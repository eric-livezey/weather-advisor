import { createConnection } from "mysql";

/** 
 * Coordinates of the 10 most populous cities in the northeastern U.S.
 * according to [wikipedia](https://en.wikipedia.org/wiki/Northeast_megalopolis).
 * 
 * Coordinates sourced from Google's geocoding API.
 */
const LOCATIONS = [
    // New York City, New York
    [40.7127753, -74.0059728],
    // Philadelphia, Pennsylvania
    [39.9525839, -75.1652215],
    // Hempstead, New York
    [40.7060923, -73.61876149999999],
    // Washington, District of Columbia
    [38.9071923, -77.0368707],
    // Boston, Massachusetts
    [42.3555076, -71.0565364]
];
const INTERVAL = 3;
const DELAY = 15;

async function collectObservations(conn) {
    const date = new Date();
    // TODO: Collect observation data and store it in the database
    console.log(date.toLocaleString() + ":", "COLLECT_OBSERVATION");
}

async function collectForecasts(conn) {
    const date = new Date();
    // TODO: Collect forecast data and store it in the database
    console.log(date.toLocaleString() + ":", "COLLECT_FORECAST");

}

async function initiateCollection() {
    // create mysql connection
    const conn = createConnection({
        host: "localhost",
        user: "admin",
        password: process.env.MY_SQL_PASSWORD,
        database: "weather_advisor"
    });
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
            setTimeout(() => {
                n++;
                // connection.connect();
                collectObservations(conn);
                // if INTERVAL hours have passed, collect forecasts
                if (n === INTERVAL) {
                    collectForecasts(conn);
                    n = 0;
                }
                // connection.end();
                resolve();
            }, date.getTime() - Date.now());
        });
    }
}

export {
    initiateCollection
};