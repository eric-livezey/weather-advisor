import { format } from "mysql";

/**
 * @type {typeof import("./database").ForecastProviderType}
 */
const ForecastProviderType = Object.freeze({
    NWS: 0,
    IBM: 1,
    MSN: 2,
    ACCUWEATHER: 3
});

const COLUMNS = ["location", "provider", "timestamp", "hour", "temperature", "precipitation", "wind_speed"];

/**
 * @type {{ [P in import("./database").ForecastProviderType]: { normalize?: (obj: import("./database").ForecastDataTypes[P]) => Record<string, any>[]; columns: { [K in keyof import("./database").Forecast]?: { key: string; convert?: (val: any, index: number, data: import("./database").ForecastDataTypes[P], location: Location, date: Date) => import("./database").Forecast[K]; } }; } }}
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
                key: "temp",
                convert: (val) => Number(val.replaceAll(/[^0-9]/g, ""))
            },
            precipitation: {
                key: "precip",
                convert: (val) => Number(val.replaceAll(/[^0-9]/g, ""))
            },
            wind_speed: {
                key: "wind",
                convert: (val) => Number(val.replaceAll(/[^0-9]/g, ""))
            }
        }
    }
};

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
                const now = new Date();
                // previous column will always be timestamp because of the ordering of COLUMNS
                const timestamp = row[row.length - 1];
                let hour = now.getTime() - timestamp.getTime();
                hour = Math.floor(hour / 3600000);
                row.push(hour);
            } else {
                row.push(null);
            }
        }
        rows.push(row);
    }
    const sql = format(`INSERT INTO forecasts (${COLUMNS.join(", ")}) VALUES ${rows.map(row => `ROW(${row.map(() => "?").join(", ")})`).join(", ")};`, rows.flat());
    return await query(conn, sql);
}

export {
    ForecastProviderType,
    query,
    insertForecasts
};