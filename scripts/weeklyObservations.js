import { createConnection, format } from "mysql";
import { getStationObservations } from "../api/nws/index.js";
import { insertObservation, query } from "../database/database.js";

// Collects Observations for the Past Week

const MY_SQL_CONFIG = {
    host: "localhost",
    user: "root",
    password: process.env.MY_SQL_PASSWORD,
    database: "weather_advisor"
};

const conn = createConnection(MY_SQL_CONFIG);
conn.connect();
// get locations
const { results: locations } = await query(conn, "SELECT * FROM locations;");
await collectObservations(conn, locations);
conn.end();

async function collectObservations(conn, locations) {
    console.log(new Date().toLocaleString() + ":", "BEGIN COLLECT OBSERVATIONS");
    // store collected stations so as not to collect from the same station twice
    for (const { station_id: stationId } of locations) {
        // if station ID is present and not yet collected
        if (stationId) {
            try {
                const { features } = await getStationObservations(stationId);
                const collectedDates = new Set();
                for (const feature of features) {
                    const observation = feature.properties;
                    const timestamp = observation.timestamp;
                    const date = new Date(timestamp);
                    date.setMinutes(0, 0, 0);
                    if (!collectedDates.has(date.toISOString())) {
                        collectedDates.add(date.toISOString());
                        const { results: [row] } = await query(conn, format("SELECT timestamp,station_id FROM observations WHERE timestamp=? AND station_id=?", [date, stationId]));
                        if (row) {
                            await query(conn, format("DELETE FROM observations WHERE  timestamp=? AND station_id=?", [date, stationId]));
                        }
                        insertObservation(conn, observation, date);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    console.log(new Date().toLocaleString() + ":", "END COLLECT OBSERVATIONS");
}
