/*
 * For scraping weather directly from msn
 */

const BASE_URL = "https://api.msn.com";

async function request(endpoint, params) {
    const url = new URL(BASE_URL + endpoint);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value);
    }
    url.searchParams.set("apiKey", process.env.MSN_API_KEY);
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "Origin": "https://www.msn.com",
        "Referrer": "https://www.msn.com/"
    };
    const res = await fetch(url, { headers });
    if (res.ok) {
        return await res.json();
    } else {
        throw new Error(`${res.status} ${res.statusText}`);
    }
}

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
    return await request("/weather/overview", params);
}

export {
    getWeatherOverview
};