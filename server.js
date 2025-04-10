import express from "express";
import { getAccuracyData, getLocation, getProviderSummaries, initiateCollection } from "./collect.js";
import compression from "compression";
import minify from "express-minify";

initiateCollection();

const app = express();
const port = 8080;

app.disable("x-powered-by");
app.use(compression());
app.use(minify());
app.use(express.static("public"));
app.get("/", (_, res) => {
    res.sendFile("home.html", { root: "./pages" });
});
app.get("/home", (_, res) => {
    res.status(301).location("/").send();
});
app.get("/faq", (_, res) => {
    res.sendFile("faq.html", { root: "./pages" });
});

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
    if (req.query.provider && req.query.location) {
        const { provider, location } = req.query;
        try {
            const data = await getAccuracyData(provider, location);
            res.json(data);
        }
        catch (e) {
            // something went wrong
            console.error(e);
            res.status(500).send();
        }
    } else {
        // no provider and/or location (bad request)
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});