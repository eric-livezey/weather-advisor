import express from "express";
import { geocode } from "./api/geocoding/index.js";
import { initiateCollection } from "./collect.js";
import { config } from "./env.js";

config();
initiateCollection();

const app = express();
const port = 3000;

app.disable("x-powered-by");
app.use(express.static("public"));

app.get("/api/forecast/services", async (req, res) => {
    // TODO: Return a list of weather services with a summary of each's accuracy.
    if (req.query.address) {
        try {
            const location = await geocode(req.query.address);
            res.type("json");
            res.send({
                address: location.formatted_address,
                services: []
            });
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(400);
    }
});

app.get("/api/forecast/services/:service", (req, res) => {
    // TODO: Return a representation of the accuracy of a particular service
    const service = req.params["service"];
    res.type("json");
    res.send({ service });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});