import express from "express";
import { config } from "./env.js";
import { geocode } from "./api/geocoding/index.js";

config();

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/api/forecast/services", async (req, res) => {
    // TODO: Return a list of weather services with a summary of each's accuracy.
    const address = req.query["address"];
    if (!address) {
        res.sendStatus(400);
    } else {
        const location = await geocode(address).catch(() => null);
        res.type("json").send({
            address: location ? location.formatted_address : null,
            services: []
        });
    }
});

app.get("/api/forecast/services/:service", (req, res) => {
    // TODO: Return a representation of the accuracy of a particular service
    const service = req.params["service"];
    res.type("json").send({ service });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});