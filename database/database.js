import { format } from "mysql";

const COLUMNS = ["location", "provider", "timestamp", "hour", "temperature", "precipitation", "wind_speed"];

const ForecastProviderType = {
    IBM: 0,
    MSN: 1,
    ACCUWEATHER: 2,
}
Object.freeze(ForecastProviderType);

/**
 * Mappings and conversions for different api forecast objects
 * @type {{ [key: number]: { normalize?: (obj) => any[], columns:{ [key: string]: { key: string, convert?: (val: any) => any } } } }}
 */
const MAPPINGS = {
    [ForecastProviderType.IBM]: {
        normalize: (obj) => {
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
                convert: val => new Date(val * 1000)
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
        normalize: (obj) => {
            return obj.value[0].responses[0].weather[0].forecast.days.map(day => day.hourly).flat();
        },
        columns: {
            timestamp: {
                key: "valid",
                convert: val => new Date(Date.parse(val))
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
                convert: val => {
                    const date = new Date();
                    let [hour, period] = val.split(" ");
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
                    if (currentPeriod === "PM" && period === "AM" || currentPeriod === period && currentHour >= hour) {
                        date.setDate(date.getDate() + 1);
                    }
                    return date;
                }
            },
            temperature: {
                key: "temp",
                convert: val => Number(val.replaceAll(/[^0-9]/g, ""))
            },
            precipitation: {
                key: "precip",
                convert: val => Number(val.replaceAll(/[^0-9]/g, ""))
            },
            wind_speed: {
                key: "wind",
                convert: val => Number(val.replaceAll(/[^0-9]/g, ""))
            }
        }
    }
};

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

async function insertForecasts(conn, data, provider, location) {
    let forecasts = data;
    if (MAPPINGS[provider].normalize) {
        forecasts = MAPPINGS[provider].normalize(forecasts);
    }
    const rows = [];
    for (const forecast of forecasts) {
        const row = [];
        const mappings = MAPPINGS[provider].columns;
        for (const column of COLUMNS) {
            const mapping = mappings[column];
            if (mapping && mapping.key in forecast) {
                let value = forecast[mapping.key];
                if (mapping.convert) {
                    value = mapping.convert(value);
                }
                row.push(value);
            } else if (column === "provider") {
                row.push(provider);
            } else if (column === "location") {
                row.push(location.id);
            } else if (column === "hour") {
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
    insertForecasts
};