import { request } from "../utils.js";

const BASE_URL = "https://api.weather.com/v3/wx";

/**
 * @param {string} endpoint 
 * @param {import("../utils").RequestOptions} options 
 */
async function requestAPI(endpoint, options) {
    options = options || {};
    const params = { apiKey: process.env.WEATHER_COMPANY_API_KEY, ...options.params };
    const headers = { ...options.headers }
    return await request(BASE_URL, endpoint, { params, headers });
}

/**
 * @type {import("./index").getForecastHourly2Day}
 */
async function getForecastHourly2Day(lat, lng) {
    const params = {
        geocode: `${lat},${lng}`,
        format: "json",
        units: "e",
        language: "en-US"
    };
    return await requestAPI("/forecast/hourly/2day", { params });
}

export {
    getForecastHourly2Day
};