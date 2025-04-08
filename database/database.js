import { format } from "mysql";

/**
 * @type {typeof import("./database").ForecastProviderType}
 */
const ForecastProviderType = Object.freeze({
    NWS: 0,
    IBM: 1,
    MSN: 2,
    ACCUWEATHER: 3,
    OPEN_WEATHER_MAP: 4
});

const COLUMNS = ["location", "provider", "timestamp", "hour", "temperature", "precipitation", "humidity", "wind_speed"];

/**
 * @type {{ [P in import("./database").ForecastProviderType]: { normalize?: (obj: import("./database").ForecastDataTypes[P]) => Record<string, any>[]; columns: { [K in keyof import("./database").Forecast]?: { key: string; convert?: (val: any, index: number, data: import("./database").ForecastDataTypes[P], location: Location, date: Date) => import("./database").Forecast[K]; }; }; }; }}
 */
const MAPPINGS = {
    [ForecastProviderType.NWS]: {
        normalize: obj => {
            return obj.periods || [];
        },
        columns: {
            timestamp: {
                key: "startTime",
                convert: val => new Date(Date.parse(val))
            },
            temperature: {
                key: "temperature",
                convert: val => typeof val === "number" ? val : val?.value
            },
            precipitation: {
                key: "probabilityOfPrecipitation",
                convert: val => val?.value
            },
            humidity: {
                key: "relativeHumidity",
                convert: val => val?.value
            },
            wind_speed: {
                key: "windSpeed",
                convert: val => typeof val === "string" ? Number(val.replaceAll(/[^0-9]/g, "")) : val?.value
            }
        }
    },
    [ForecastProviderType.IBM]: {
        normalize: obj => {
            const arr = [];
            for (const [key, value] of Object.entries(obj)) {
                if (value) {
                    for (let i = 0; i < value.length; i++) {
                        if (arr.length <= i) {
                            arr.push({});
                        }
                        arr[i][key] = value[i];
                    }
                }
            }
            return arr;
        },
        columns: {
            timestamp: {
                key: "validTimeUtc",
                convert: (val) => new Date(val * 1000)
            },
            temperature: {
                key: "temperature"
            },
            precipitation: {
                key: "precipChance"
            },
            humidity: {
                key: "relativeHumidity"
            },
            wind_speed: {
                key: "windSpeed"
            }
        }
    },
    [ForecastProviderType.MSN]: {
        normalize: obj => {
            return obj.value[0].responses[0].weather[0].forecast.days.map(day => day.hourly).flat();
        },
        columns: {
            timestamp: {
                key: "valid",
                convert: (val) => new Date(Date.parse(val))
            },
            temperature: {
                key: "temp"
            },
            precipitation: {
                key: "precip"
            },
            humidity: {
                key: "rh"
            },
            wind_speed: {
                key: "windSpd"
            }
        }
    },
    [ForecastProviderType.ACCUWEATHER]: {
        columns: {
            timestamp: {
                key: "time",
                convert: (val, index, _data, _location, date) => {
                    date = new Date(date.getTime());
                    let hour, period;
                    [hour, period] = val.split(" ");
                    hour = Number(hour);
                    if (hour === 12) {
                        hour = 0;
                    }
                    const currentHour = date.getHours() % 12;
                    const currentPeriod = date.getHours() < 12 ? "AM" : "PM";
                    if (period === "AM") {
                        date.setHours(hour, 0, 0, 0);
                    } else {
                        date.setHours(hour + 12, 0, 0, 0);
                    }
                    date.setDate(date.getDate() + Math.floor(index / 24));
                    if (currentPeriod === "PM" && period === "AM" || currentPeriod === period && currentHour >= hour) {
                        date.setDate(date.getDate() + 1);
                    }
                    return date;
                }
            },
            temperature: {
                key: "temperature",
                convert: (val) => Number(val.replaceAll(/[^0-9]/g, ""))
            },
            precipitation: {
                key: "precipitation",
                convert: (val) => Number(val.replaceAll(/[^0-9]/g, ""))
            },
            humidity: {
                key: "humidity",
                convert: (val) => Number(val.replaceAll(/[^0-9]/g, ""))
            },
            wind_speed: {
                key: "wind",
                convert: (val) => Number(val.replaceAll(/[^0-9]/g, ""))
            }
        }
    },
    [ForecastProviderType.OPEN_WEATHER_MAP]: {
        normalize: (obj) => obj.list,
        columns: {
            timestamp: {
                key: "dt",
                convert: (val) => new Date(val * 1000)
            },
            temperature: {
                key: "main",
                convert: (val) => val.temp
            },
            precipitation: {
                key: "pop",
                convert: (val) => Math.round(val * 100)
            },
            humidity: {
                key: "main",
                convert: (val) => val.humidity
            },
            wind_speed: {
                key: "wind",
                convert: (val) => val.speed
            }
        }
    }
};

function celciusToFahrenheit(value) {
    return value * 9 / 5 + 32;
}

function kphToMph(value) {
    return value / 1.609;
}

/**
 * @type {import("./database").query}
 */
function query(conn, options) {
    return new Promise((resolve, reject) => {
        conn.query(options, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve({ results, fields });
            }
        });
    });
}

/**
 * @type {import("./database").insertObservation}
 */
async function insertObservation(conn, data, date) {
    const station = data.station.substring(data.station.lastIndexOf("/") + 1);
    const timestamp = date;
    const temperature = data.temperature?.value == null ? null : celciusToFahrenheit(data.temperature.value);
    const precipitation = data.precipitationLastHour?.value == null ? null : data.precipitationLastHour?.value ? 1 : 0;
    const humidity = data.relativeHumidity?.value == null ? null : data.relativeHumidity?.value;
    const windSpeed = data.windSpeed?.value == null ? null : kphToMph(data.temperature.value);
    const values = [station, timestamp, temperature, precipitation, humidity, windSpeed];
    const sql = format("INSERT INTO observations (station_id, timestamp, temperature, precipitation, humidity, wind_speed) VALUES (?, ?, ?, ?, ?, ?)", values);
    return await query(conn, sql);
}

/**
 * @type {import("./database").insertForecasts}
 */
async function insertForecasts(conn, provider, data, location, date) {
    let forecasts = data;
    const mappings = MAPPINGS[provider];
    if (mappings.normalize) {
        forecasts = MAPPINGS[provider].normalize(forecasts);
    }
    if (!Array.isArray(forecasts)) {
        throw new TypeError("forecasts could not be resolved to an array");
    }
    const rows = [];
    for (let i = 0; i < forecasts.length; i++) {
        const forecast = forecasts[i];
        const row = [];
        const mappings = MAPPINGS[provider].columns;
        let valid = true;
        for (const key of COLUMNS) {
            const mapping = mappings[key];
            if (mapping && mapping.key in forecast) {
                let value = forecast[mapping.key];
                if (mapping.convert) {
                    value = mapping.convert(value, i, data, location, date);
                }
                row.push(value);
            } else if (key === "provider") {
                row.push(provider);
            } else if (key === "location") {
                row.push(location.id);
            } else if (key === "hour") {
                // previous column will always be timestamp because of the ordering of COLUMNS
                const timestamp = row[row.length - 1];
                let hour = date.getTime() - timestamp.getTime();
                hour = Math.floor(hour / 3600000);
                // if the forecast is for now or earlier, skip it
                if (hour >= 0) {
                    valid = false;
                    break;
                }
                row.push(hour);
            } else {
                row.push(null);
            }
        }
        if (valid) {
            rows.push(row);
        }
    }
    const sql = format(`INSERT INTO forecasts (${COLUMNS.join(", ")}) VALUES ${rows.map(row => `ROW(${row.map(() => "?").join(", ")})`).join(", ")};`, rows.flat());
    return await query(conn, sql);
}

export {
    ForecastProviderType,
    query,
    insertObservation,
    insertForecasts
};