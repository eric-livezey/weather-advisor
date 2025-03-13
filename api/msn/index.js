import { request } from "../utils.js";

/*
 * For scraping weather directly from msn
 */

const BASE_URL = "https://api.msn.com";
const BASE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    "Origin": "https://www.msn.com",
    "Referrer": "https://www.msn.com/"
};

/**
 * @param {string} endpoint 
 * @param {import("../utils").RequestOptions} options 
 */
async function requestAPI(endpoint, options) {
    options = options || {};
    const params = new URLSearchParams(options.params);
    params.set("apiKey", process.env.MSN_API_KEY);
    const headers = { ...BASE_HEADERS, ...options.headers }
    return await request(BASE_URL, endpoint, { params, headers });
}

/**
 * @type {import("./index").getWeatherOverview}
 */
async function getWeatherOverview(lat, lng) {
    const params = {
        lat,
        lon: lng,
        startDate: 0,
        endDate: 9,
        days: 10,
        region: "us",
        market: "en-us",
        locale: "en-us"
    };
    return await requestAPI("/weather/overview", { params });
}

export {
    getWeatherOverview
};