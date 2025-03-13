import { createConnection } from "mysql";
import { getWeatherForecast } from "./api/accuweather/index.js";
import { getForecastHourly2Day } from "./api/ibm/index.js";
import { getWeatherOverview } from "./api/msn/index.js";
import { getGridpointForecastHourly, getPoint, getStationObservationsTime, GridpointForecastUnits } from "./api/nws/index.js";
import { ForecastProviderType, insertForecasts, query } from "./database/database.js";

const INTERVAL = 3;
const DELAY = 15;

/**
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<import("./api/nws").GridpointForecast>}
 */
async function getNwsForecast(lat, lng) {
    let feature = await getPoint(lat, lng);
    const point = feature.properties;
    if (!point.gridId || !point.gridX || !point.gridY) {
        return {};
    }
    feature = await getGridpointForecastHourly(point.gridId, point.gridX, point.gridY, { units: GridpointForecastUnits.US });
    return feature.properties;
}

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
    },
    {
        type: ForecastProviderType.NWS,
        fn: getNwsForecast
    }
];

async function collectObservations(conn, locations, date) {
    console.log(new Date().toLocaleString() + ":", "BEGIN COLLECT OBSERVATIONS");
    for (const location of locations) {
        const stationId = location.station_id;
        const { x: lat, y: lng } = location.coordinates;
        try {
            // const data = await getStationObservationsTime(stationId, date.toISOString());
            // await insertObservations(conn, data);
            // const forecast = await getNwsForecast(lat, lng);
            // get the forecast for the current hour
            // const period = forecast.periods.find(p => new Date(Date.parse(p.startTime)).getTime() === date.getTime());
            // forecast.periods = period ? [period] : [];
            // await insertForecasts(conn, ForecastProviderType.NWS, forecast, location, date);
        } catch (e) {
            console.error(e);
        }
    }
    console.log(new Date().toLocaleString() + ":", "END COLLECT OBSERVATIONS");
}

async function collectForecasts(conn, locations, date) {
    console.log(new Date().toLocaleString() + ":", "BEGIN COLLECT FORECASTS");
    for (const location of locations) {
        for (const provider of PROVIDERS) {
            const { x: lat, y: lng } = location.coordinates;
            try {
                // fetch forecasts
                const data = await provider.fn(lat, lng, location);
                if (data.find())
                // insert forecasts
                await insertForecasts(conn, provider.type, data, location, date);
            } catch (e) {
                console.error(e);
            }
        }
    }
    console.log(new Date().toLocaleString() + ":", "END COLLECT FORECASTS");
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
                date.setMinutes(0, 0, 0);
                // collect observations
                await collectObservations(conn, locations, date);
                // if INTERVAL hours have passed
                if (n === INTERVAL) {
                    // collect forecasts
                    await collectForecasts(conn, locations, date);
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