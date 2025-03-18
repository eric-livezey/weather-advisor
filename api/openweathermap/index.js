import { request } from "../utils.js";

const BASE_URL = "https://pro.openweathermap.org";

/**
 * @param {string} endpoint 
 * @param {import("../utils").RequestOptions} options 
 */
async function requestAPI(endpoint, options) {
    options = options || {};
    const params = new URLSearchParams(options.params);
    params.set("appid", process.env.OPEN_WEATHER_MAP_API_KEY);
    return await request(BASE_URL, endpoint, { params, headers: options.headers });
}

/**
 * @type {import("./index").getHourlyForecastData}
 */
async function getHourlyForecastData(lat, lng) {
    const params = {
        lat,
        lon: lng,
        mode: "json",
        cnt: 96,
        lang: "en",
        units: "imperial"
    }
    return await requestAPI("/data/2.5/forecast/hourly", { params });
}

export {
    getHourlyForecastData
};