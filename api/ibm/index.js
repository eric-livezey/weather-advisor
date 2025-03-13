import { request } from "../utils.js";

const BASE_URL = "https://api.weather.com";

/**
 * @param {string} endpoint 
 * @param {import("../utils").RequestOptions} options 
 */
async function requestAPI(endpoint, options) {
    options = options || {};
    const params = new URLSearchParams(options.params);
    params.set("apiKey", process.env.WEATHER_COMPANY_API_KEY);
    return await request(BASE_URL, endpoint, { params, headers: options.headers });
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
    return await requestAPI("/v3/wx/forecast/hourly/2day", { params });
}

export {
    getForecastHourly2Day
};