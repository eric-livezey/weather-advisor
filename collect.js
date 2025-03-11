import { createConnection } from "mysql";
import { getWeatherForecast } from "./api/accuweather/index.js";
import { getForecastHourly2Day } from "./api/ibm/index.js";
import { getWeatherOverview } from "./api/msn/index.js";
import { ForecastProviderType, insertForecasts } from "./database/database.js";

const PROVIDERS = [
    {
        type: ForecastProviderType.IBM,
        fn: getForecastHourly2Day
    },
    {
        type: ForecastProviderType.MSN,
        fn: getWeatherOverview
    },
    {
        type: ForecastProviderType.ACCUWEATHER,
        fn: getWeatherForecast
    }
];
const INTERVAL = 3;
const DELAY = 15;

/**
 * 
 * @param {import("mysql").Connection} conn 
 * @param {string|import("mysql").QueryOptions} options 
 * @returns {Promise<{results:any;fields:FieldInfo[]|undefined}>}
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

async function collectObservations(conn, locations) {
    const date = new Date();
    // TODO: Collect observation data and store it in the database
    console.log(date.toLocaleString() + ":", "COLLECT OBSERVATIONS");
}

async function collectForecasts(conn, locations, providers) {
    const date = new Date();
    console.log(date.toLocaleString() + ":", "COLLECT FORECASTS");
    for (const location of locations) {
        for (const provider of providers) {
            const { x: lat, y: lng } = location.coordinates;
            try {
                const data = await provider.fn(lat, lng);
                await insertForecasts(conn, data, provider.type, location);
            } catch (e) {
                console.error(e);
            }
        }
    }

}

async function initiateCollection() {
    // collect every hour
    const now = new Date();
    let n = now.getHours();
    // decrement n if data is yet to be collected this hour
    if (now.getMinutes() < DELAY)
        n--;
    n -= Math.floor(n / INTERVAL) * INTERVAL;
    while (1) {
        const date = new Date();
        // set time to DELAY minutes after the hour to account for any delays in data updating
        if (date.getMinutes() >= DELAY)
            date.setHours(date.getHours() + 1);
        date.setMinutes(DELAY, 0, 0);
        await new Promise(resolve => {
            setTimeout(async () => {
                n++;
                // create mysql connection
                const conn = createConnection({
                    host: "localhost",
                    user: "root",
                    password: process.env.MY_SQL_PASSWORD,
                    database: "weather_advisor"
                });
                conn.connect();
                // get locations
                const { results: locations } = await query(conn, "SELECT * FROM locations;");
                // collect observations
                await collectObservations(conn, locations, PROVIDERS);
                // if INTERVAL hours have passed, collect forecasts
                if (n === INTERVAL) {
                    await collectForecasts(conn, locations, PROVIDERS);
                    n = 0;
                }
                conn.end(() => { resolve() });
            }, date.getTime() - Date.now());
        });
    }
}

export {
    initiateCollection
};