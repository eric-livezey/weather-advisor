import express from "express";
import { geocode } from "./api/geocoding/index.js";
import { initiateCollection } from "./collect.js";

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
            res.json({
                address: location.formatted_address,
                services: [
                    {
                        name: "Nation Weather Service",
                        url: "https://weather.gov/",
                        summary: [
                            {
                                label: "Temperature",
                                value: 2.4
                            },
                            {
                                label: "Humidity",
                                value: 1.1
                            },
                            {
                                label: "Precipitation",
                                value: 1.1
                            },
                            {
                                label: "Wind Speed",
                                value: 1.1
                            }
                        ]
                    },
                    {
                        name: "The Weather Channel",
                        url: "https://weather.com/",
                        summary: [
                            {
                                label: "Temperature",
                                value: 1.1
                            },
                            {
                                label: "Humidity",
                                value: 1.1
                            },
                            {
                                label: "Precipitation",
                                value: 1.1
                            },
                            {
                                label: "Wind Speed",
                                value: 3.1
                            }
                        ]
                    }
                ]
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
    res.json({
        service,
        hours: 12,
        data: [
            {
                label: "temperature",
                data: [
                    {
                        timestamp: "2025-03-19T19:00:00.000Z",
                        observed: 45,
                        forecasts: [
                            {
                                hours: 3,
                                value: 44
                            },
                            {
                                hours: 6,
                                value: 43
                            }
                        ]
                    },
                    {
                        timestamp: "2025-03-19T16:00:00.000Z",
                        observed: 44,
                        forecasts: [
                            {
                                hours: 3,
                                value: 44
                            },
                            {
                                hours: 6,
                                value: 43
                            }
                        ]
                    },
                    {
                        timestamp: "2025-03-19T13:00:00.000Z",
                        observed: 43,
                        forecasts: [
                            {
                                hours: 3,
                                value: 44
                            },
                            {
                                hours: 6,
                                value: 43
                            }
                        ]
                    }
                ]
            }
        ]
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});