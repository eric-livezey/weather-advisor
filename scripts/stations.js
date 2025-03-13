
import { config } from "../env.js";
import { createConnection } from "mysql";
import { query } from "../database/database.js";
import { getGridpointStations, getPoint } from "../api/nws/index.js";

function distanceBetweenCoords(lat1, lng1, lat2, lng2) {
    lat1 *= Math.PI / 180;
    lng1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    lng2 *= Math.PI / 180;
    return Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)) * 6371;
}

config();

// create mysql connection
const conn = createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MY_SQL_PASSWORD,
    database: "weather_advisor"
});
// connect
conn.connect();
// query locations
const { results: locations } = await query(conn, "SELECT * FROM locations");
for (const location of locations) {
    // fetch point for location coords
    const { x: lat, y: lng } = location.coordinates;
    const pointResponse = await getPoint(lat, lng);
    const point = pointResponse.properties;
    // fetch stations valid for the given point
    let stationsResponse = await getGridpointStations(point.gridId, point.gridX, point.gridY);
    const features = stationsResponse.features;
    // if additional pages are present, fetch them and add the result to features
    while (features.length === 500 && stationsResponse.pagination) {
        const url = new URL(stationsResponse.pagination.next);
        const cursor = url.searchParams.get("cursor");
        stationsResponse = await getGridpointStations(point.gridId, point.gridX, point.gridY, { cursor: cursor });
    }
    // find the closest stations (usually the first entry, but just to be sure)
    let result = null, shortest = Infinity;
    for (const feature of features) {
        if (feature.geometry.type === "Point") {
            const [lng2, lat2] = feature.geometry.coordinates;
            const dist = distanceBetweenCoords(lat, lng, lat2, lng2);
            if (result === null || dist < shortest) {
                shortest = dist;
                result = feature;
            }
        } else {
            // feature geometry should always be point so log if it isn't
            console.log(feature);
        }
    }
    console.log(shortest);
    // update locations
    conn.query(`UPDATE locations SET station_id='${result.properties.stationIdentifier}' WHERE id=${location.id}`);
}
// end connection
conn.end();