import { createConnection } from "mysql";
import { getWeatherForecast } from "./api/accuweather/index.js";
import { getForecastHourly2Day } from "./api/ibm/index.js";
import { getWeatherOverview } from "./api/msn/index.js";
import { getGridpointForecastHourly, getPoint, GridpointForecastUnits } from "./api/nws/index.js";
import { ForecastProviderType, insertForecasts, insertObservation, query } from "./database/database.js";
import { getStationObservations } from "./api/nws/index.js";

const INTERVAL = 3;
const DELAY = 15;
const PROVIDERS = [
    {
        type: ForecastProviderType.NWS,
        fn: async (lat, lng) => {
            let feature = await getPoint(lat, lng);
            const point = feature.properties;
            if (!point.gridId || !point.gridX || !point.gridY) {
                return {};
            }
            feature = await getGridpointForecastHourly(point.gridId, point.gridX, point.gridY, { units: GridpointForecastUnits.US });
            return feature.properties;
        }
    },
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

const missedStations = {};

/**
 * 
 * @param {import("mysql").Connection} conn 
 * @param {import("./database/database.js").Location[]} locations 
 * @param {Date} date 
 */
async function collectObservations(conn, locations, date) {
    // NOTE: Observations are currently collected from NWS from "/station/observations" for the closest valid station
    // to a location. Observations are frequently not present for the previous hour when observed so missed stations
    // are stored to be collected in the next cycle. These observations are also typically not on the hour exactly so
    // the observed value is actually from some time after the specified date.
    // The main issue with this is that the measured precipitation is cumulative over the last hour so if the observation
    // was not collected exactly at the end of the hour period, it will overlap with the previous one and potentially be
    // inaccurate to compare with the forecast.
    console.log(new Date().toLocaleString() + ":", "BEGIN COLLECT OBSERVATIONS");
    // collect from one hour ago since the observation should be during the hour
    date = new Date(date.getTime());
    date.setHours(date.getHours() - 1);
    // collect any missed observations
    for (const [id, { stationId, date, expires }] of Object.entries(missedStations)) {
        if (date >= expires) {
            // delete expired observations
            delete missedStations[id];
            continue;
        }
        const start = new Date(date.getTime() - 1);
        const end = new Date(date.getTime());
        start.setHours(date.getHours() - 1);
        end.setHours(date.getHours());
        try {
            const { features } = await getStationObservations(stationId, { start: start.toISOString(), end: end.toISOString() });
            if (features.length > 0) {
                const observation = features[0].properties;
                observation.timestamp = start.toISOString();
                await insertObservation(conn, observation, date);
                delete missedStations[id];
            }
        } catch (e) {
            delete missedStations[id];
            console.error(e);
        }
    }
    // store collected stations so as not to collect from the same station twice
    const collectedStations = new Set();
    for (const { station_id: stationId } of locations) {
        // if station ID is present and not yet collected
        if (stationId && !collectedStations.has(stationId)) {
            const start = new Date(date.getTime());
            const end = new Date(date.getTime());
            start.setHours(date.getHours() - 1);
            end.setHours(date.getHours());
            try {
                const { features } = await getStationObservations(stationId, { start: start.toISOString(), end: end.toISOString() });
                if (features.length > 0) {
                    const observation = features[0].properties;
                    observation.timestamp = start.toISOString();
                    await insertObservation(conn, observation, date);
                    collectedStations.add(stationId);
                } else {
                    // no observations were available so we should cache it
                    const expires = new Date(date.getTime());
                    // expires after 24 hours
                    expires.setHours(date.getHours() + 24);
                    missedStations[`${stationId}-${date.toISOString()}`] = { stationId, date, expires };
                }
            } catch (e) {
                console.error(e);
            }
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