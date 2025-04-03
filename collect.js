import { existsSync, readFileSync, writeFileSync } from "fs";
import { createConnection, format } from "mysql";
import { getWeatherForecast } from "./api/accuweather/index.js";
import { geocode } from "./api/geocoding/index.js";
import { getForecastHourly2Day } from "./api/ibm/index.js";
import { getWeatherOverview } from "./api/msn/index.js";
import { getGridpointForecastHourly, getPoint, getStationObservations, GridpointForecastUnits } from "./api/nws/index.js";
import { getHourlyForecastData } from "./api/openweathermap/index.js";
import { ForecastProviderType, insertForecasts, insertObservation, query } from "./database/database.js";

const INTERVAL = 3;
const DELAY = 15;
const PROVIDERS = [
    {
        name: "National Weather Service",
        siteName: "National Weather Service",
        url: "https://www.weather.gov/",
        type: ForecastProviderType.NWS,
        getForecasts: async (lat, lng) => {
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
        name: "IBM",
        siteName: "The Weather Channel",
        url: "https://weather.com/",
        type: ForecastProviderType.IBM,
        getForecasts: getForecastHourly2Day
    },
    {
        name: "msn",
        siteName: "msn",
        url: "https://www.msn.com/",
        type: ForecastProviderType.MSN,
        getForecasts: getWeatherOverview
    },
    {
        name: "AccuWeather",
        siteName: "AccuWeather",
        url: "https://www.accuweather.com/",
        type: ForecastProviderType.ACCUWEATHER,
        getForecasts: getWeatherForecast
    },
    {
        name: "OpenWeatherMap",
        siteName: "OpenWeather",
        url: "https://openweathermap.org/",
        type: ForecastProviderType.OPEN_WEATHER_MAP,
        getForecasts: getHourlyForecastData
    }
];
const MY_SQL_CONFIG = {
    host: "localhost",
    user: "root",
    password: process.env.MY_SQL_PASSWORD,
    database: "weather_advisor"
};

/**
 * @param {string} address 
 * @returns {Promise<{id:number;address:string;distance:number;}|null>}
 */
async function getLocation(address) {
    const location = await geocode(address);
    if (!location)
        return null;
    const { lat, lng } = location.geometry.location;
    const x = lat * Math.PI / 180;
    const y = lng * Math.PI / 180;
    // function to get distance in km
    const distance = `ACOS(SIN(ST_X(coordinates) * PI() / 180) * SIN(${x}) + COS(ST_X(coordinates) * PI() / 180) * COS(${x}) * COS(${y} - ST_Y(coordinates) * PI() / 180)) * 6371`
    // no need for santiziation since x and y are definitively numbers
    const sql = `SELECT id, address, ${distance} as distance FROM locations WHERE ${distance}=(SELECT MIN(${distance}) FROM locations)`;
    const conn = createConnection(MY_SQL_CONFIG);
    conn.connect();
    const { results: rows } = await query(conn, sql);
    conn.end();
    // make sure it's within 15 km
    return rows.length > 0 && rows[0].distance < 15 ? rows[0] : null;
}

async function getProviderSummaries(locationId) {
    const result = [];
    const conn = createConnection(MY_SQL_CONFIG);
    conn.connect();
    for (const provider of PROVIDERS) {
        // calculate accuracies
        const sql = format("SELECT\n" +
            "TRUNCATE(AVG(ABS(forecasts.temperature - ROUND(observations.temperature))), 2) as temperature,\n" +
            "TRUNCATE(AVG(1 - POW(ABS(observations.precipitation - forecasts.precipitation / 100), 2)), 2) * 100 AS precipitation,\n" +
            "TRUNCATE(AVG(ABS(forecasts.wind_speed - observations.wind_speed)), 2) AS windSpeed,\n" +
            "TRUNCATE(AVG(ABS(forecasts.humidity - observations.humidity)), 2) AS humidity\n" +
            "FROM forecasts\n" +
            "INNER JOIN locations ON forecasts.location=locations.id\n" +
            "INNER JOIN observations ON observations.station_id=locations.station_id AND observations.timestamp=forecasts.timestamp\n" +
            "WHERE provider=? AND location=? AND forecasts.timestamp>DATE_SUB(CURTIME(), INTERVAL 7 DAY) AND hour=-3;", [provider.type, locationId]);
        const { results: rows } = await query(conn, sql);
        const row = rows[0];
        const summary = [
            { label: "Temperature", value: row.temperature !== null ? `±${row.temperature}°F` : "N/A" },
            { label: "Precipitation", value: row.precipitation !== null ? `${row.precipitation}%` : "N/A" },
            { label: "Wind Speed", value: row.windSpeed !== null ? `±${row.windSpeed} MPH` : "N/A" },
            { label: "Humidity", value: row.humidity !== null ? `±${row.humidity}%` : "N/A" }
        ];
        result.push({
            id: provider.type,
            name: provider.siteName,
            url: provider.url,
            summary
        });
    }
    conn.end();
    return result;
}

/**
 * 
 * @param {ForecastProviderType} provider 
 * @param {number} locationId
 */
async function getAccuracyData(provider, locationId) {
    // select accuracy data for the past 7 days
    const fields = [
        "forecasts.timestamp AS date",
        "hour",
        "forecasts.temperature AS temperaturePredicted",
        "ROUND(observations.temperature) AS temperatureObserved",
        "ABS(forecasts.temperature - ROUND(observations.temperature)) AS temperatureAccuracy",
        "forecasts.precipitation / 100 AS precipitationPredicted",
        "CAST(observations.precipitation AS SIGNED) AS precipitationObserved",
        "1 - POW(ABS(observations.precipitation - forecasts.precipitation / 100), 2) AS precipitationAccuracy",
        "forecasts.wind_speed as windSpeedPredicted",
        "observations.wind_speed as windSpeedObserved",
        "ABS(forecasts.wind_speed - observations.wind_speed) AS windSpeedAccuracy",
        "forecasts.humidity as humidityPredicted",
        "observations.humidity as humidityObserved",
        "ABS(forecasts.humidity - observations.humidity) AS humidityAccuracy"
    ].join(", ");
    const from = [
        "forecasts",
        "INNER JOIN locations ON forecasts.location=locations.id",
        "INNER JOIN observations ON locations.station_id=observations.station_id AND forecasts.timestamp=observations.timestamp"
    ].join(" ");
    const where = format("provider=? AND location=? AND hour%3=0 AND forecasts.timestamp>DATE_SUB(CURTIME(), INTERVAL 7 DAY)", [provider, locationId]);
    const orderBy = "date, hour DESC";
    const rows = [];
    const limit = 10000;
    const conn = createConnection(MY_SQL_CONFIG);
    conn.connect();
    const { results: [{ count }] } = await query(conn, `SELECT COUNT(*) AS count FROM ${from} WHERE ${where};`);
    let page = 0;
    while (page * limit < count) {
        const { results } = await query(conn, `SELECT ${fields} FROM ${from} WHERE ${where} ORDER BY ${orderBy} LIMIT ${page * limit}, ${limit};`);
        rows.push(...results);
        page++;
    }
    // const { results: rows } = await query(conn, sql);
    conn.end();
    // format data
    const result = [
        {
            label: "Temperature",
            data: [],
            prefix: "±",
            suffix: "°F",
            key: "temperature"
        },
        {
            label: "Precipitation",
            data: [],
            suffix: "%",
            key: "precipitation"
        },
        {
            label: "Wind Speed",
            data: [],
            prefix: "±",
            suffix: " MPH",
            key: "windSpeed"
        },
        {
            label: "Humidity",
            data: [],
            prefix: "±",
            suffix: "%",
            key: "humidity"
        }
    ]
    // iterate through returned rows
    let i = 0;
    let j;
    while (i < rows.length) {
        // iterate through each measurement
        for (const { key, data } of result) {
            // set timestamp and observed from the first row
            const date = rows[i].date;
            const timestamp = date.toISOString();
            const observed = rows[i][key + "Observed"];
            const forecasts = [];
            // iterate through every forecast for the timestamp (query is ordered by timestamp so they will all be together)
            j = i;
            while (j < rows.length && rows[j].date.getTime() === date.getTime()) {
                const row = rows[j];
                forecasts.push({
                    hour: row.hour,
                    value: row[key + "Predicted"],
                    accuracy: row[key + "Accuracy"]
                });
                j++;
            }
            data.push({ timestamp, observed, forecasts });
        }
        // point i row after the last row with the same timestamp
        i = j;
    }
    // delete key from items (not wanted in response)
    for (const item of result) {
        delete item.key;
    }
    return result;
}

// save missed stations on the disk so they are not lost when restarted

const PATH_TO_CACHE = "./cache.json";

function savedMissedStations(data) {
    writeFileSync(PATH_TO_CACHE, JSON.stringify(data));
}

function getMissedStations() {
    return existsSync(PATH_TO_CACHE) ? JSON.parse(readFileSync(PATH_TO_CACHE).toString()) : {};
}

async function collectObservations(conn, locations, date) {
    // NOTE: Observations are currently collected from NWS from "/station/observations" for the closest valid station
    // to a location. Observations are frequently not present for the previous hour when observed so missed stations
    // are stored to be collected in the next cycle. These observations are also typically not on the hour exactly so
    // the observed value is actually from some time after the specified date. The issue with this is that the measured
    // precipitation is cumulative over the last hour so if the observation was not collected exactly at the end of the
    // hour period, it will overlap with the previous one and potentially be inaccurate to compare with the forecast.
    console.log(new Date().toLocaleString() + ":", "BEGIN COLLECT OBSERVATIONS");
    // collect from one hour ago since the observation should be during the hour
    date = new Date(date.getTime());
    date.setHours(date.getHours() - 1);
    // collect any missed observations
    const missedStations = getMissedStations();
    for (const [id, { stationId, date: timestamp, expires }] of Object.entries(missedStations)) {
        const collectionDate = new Date(timestamp);
        if (date.getTime() >= Date.parse(expires)) {
            // delete expired observations
            delete missedStations[id];
            continue;
        }
        const start = new Date(collectionDate.getTime() - 1);
        const end = new Date(collectionDate.getTime());
        start.setHours(collectionDate.getHours() - 1);
        end.setHours(collectionDate.getHours());
        try {
            const { features } = await getStationObservations(stationId, { start: start.toISOString(), end: end.toISOString() });
            if (features.length > 0) {
                const observation = features[0].properties;
                observation.timestamp = start.toISOString();
                await insertObservation(conn, observation, collectionDate);
                delete missedStations[id];
            }
        } catch (e) {
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
                // something went wrong so cache it to try again later
                const expires = new Date(date.getTime());
                // expires after 24 hours
                expires.setHours(date.getHours() + 24);
                missedStations[`${stationId}-${date.toISOString()}`] = { stationId, date, expires };
                console.error(e);
            }
        }
    }
    savedMissedStations(missedStations);
    console.log(new Date().toLocaleString() + ":", "END COLLECT OBSERVATIONS");
}

async function collectForecasts(conn, locations, date) {
    console.log(new Date().toLocaleString() + ":", "BEGIN COLLECT FORECASTS");
    for (const location of locations) {
        for (const provider of PROVIDERS) {
            const { x: lat, y: lng } = location.coordinates;
            try {
                // fetch forecasts
                let attempt = 0;
                let data = null;
                while (!data && attempt < 5) {
                    // retry in case of connection errors
                    attempt++;
                    try {
                        data = await provider.getForecasts(lat, lng);
                    } catch (e) {
                        console.error(`Forecast collection from ${provider.name} failed attempt ${attempt}/5:`, e);
                    }
                }
                // insert forecasts
                if (data) {
                    await insertForecasts(conn, provider.type, data, location, date);
                }
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
                const conn = createConnection(MY_SQL_CONFIG);
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
    getLocation,
    getProviderSummaries,
    getAccuracyData,
    initiateCollection
};