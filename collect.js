import { createConnection } from "mysql";

/** 
 * Coordinates of the 10 most populous cities in the northeastern U.S.
 * according to [wikipedia](https://en.wikipedia.org/wiki/Northeast_megalopolis).
 * 
 * Coordinates sourced from the Google Maps Geocoding API.
 */
const LOCATIONS = [
    { address: "New York City, New York", lat: 40.7127753, lng: -74.0059728 },
    { address: "Philadelphia, Pennsylvania", lat: 39.9525839, lng: -75.1652215 },
    { address: "Hempstead, New York", lat: 40.7060923, lng: -73.61876149999999 },
    { address: "Washington, District of Columbia", lat: 38.9071923, lng: -77.0368707 },
    { address: "Boston, Massachusetts", lat: 42.3555076, lng: -71.0565364 },
    { address: "Baltimore, Maryland", lat: 39.2905023, lng: -76.6104072 },
    { address: "Brookhaven, New York", lat: 40.7792653, lng: -72.9153827 },
    { address: "Virginia Beach, Virginia", lat: 36.8516437, lng: -75.97921939999999 },
    { address: "Islip, New York", lat: 40.7297786, lng: -73.2105665 },
    { address: "Newark, New Jersey", lat: 40.7315293, lng: -74.1744671 }
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