import express from "express";
import { getAccuracyData, getLocation, getProviderSummaries, initiateCollection } from "./collect.js";
import { ForecastProviderType } from "./database/database.js";

initiateCollection();

const app = express();
const port = 3000;

app.disable("x-powered-by");
app.use(express.static("public"));

app.get("/api/forecast/services", async (req, res) => {
    if (req.query.address) {
        try {
            const location = await getLocation(req.query.address);
            if (!location) {
                // no valid location
                res.status(404).send();
            } else {
                const services = await getProviderSummaries(location.id);
                res.json({
                    address: location.address,
                    id: location.id,
                    services
                });
            }
        } catch (e) {
            // something went wrong
            console.error(e);
            res.status(500).send();
        }
    } else {
        // no address (bad request)
        res.status(400).send();
    }
});

app.get("/api/forecast/accuracy", async (req, res) => {
    // TODO: Return a representation of the accuracy of a particular service
    if (req.query.provider && req.query.location) {
        const { provider, location } = req.query;
        try {
            const data = await getAccuracyData(provider, location);
            res.json({
                id: provider,
                location: location,
                data
            });
        }
        catch (e) {
            // something went wrong
            console.error(e);
            res.status(500).send();
        }
    } else {
        // no location (bad request)
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});