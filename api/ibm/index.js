import { request } from "../utils.js";

const BASE_URL = "https://api.weather.com";

// async function request(endpoint, params) {
//     const url = new URL(BASE_URL + endpoint);
//     for (const [key, value] of Object.entries(params))
//         url.searchParams.append(key, value);
//     url.searchParams.set("apiKey", process.env.WEATHER_COMPANY_API_KEY);
//     const res = await fetch(url);
//     if (res.ok)
//         return await res.json();
//     else
//         throw new Error(`${res.status} ${res.statusText}`);
// }

// async function getForecastHourly2Day(lat, lng) {
//     const params = {
//         geocode: `${lat},${lng}`,
//         format: "json",
//         units: "e",
//         language: "en-US"
//     }
//     return await request("/forecast/hourly/2day", params);
// }

// export {
//     getForecastHourly2Day
// };

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