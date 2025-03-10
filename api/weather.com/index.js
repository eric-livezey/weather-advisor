/*
 * For scraping weather directly from weather.com
 */

const BASE_URL = "https://weather.com/api/v1/p";

async function request(endpoint, payload) {
    const url = new URL(BASE_URL + endpoint);
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "Origin": "https://weather.com",
        "Referrer": "https://weather.com/",
        "Content-Type": "application/json"
    };
    const res = await fetch(url, { method: "POST", body: Buffer.from(JSON.stringify(payload)), headers });
    if (res.ok) {
        return await res.json();
    } else {
        throw new Error(`${res.status} ${res.statusText}`);
    }
}

async function getLocation(query) {
    const payload = [
        {
            name: "getSunV3LocationSearchUrlConfig",
            params: {
                query,
                language: "en-US",
                locationType: "locale"
            }
        }
    ]
    const res = await request("/redux-dal", payload);
    const config = payload[0];
    const key = Object.entries(config.params).sort(([k1], [k2]) => k1.localeCompare(k2)).map(([k, v]) => `${k}:${v}`).join(";");
    return res.dal[config.name][key];
}

const DETAIL = /<details [^>]*class="[^"]*DaypartDetails--DayPartDetail[^"]*"[^>]*>((?:(?!<\/details>).)*)<\/details>/g;
const TIME = /<h2 [^>]*class="[^"]*DetailsSummary--daypartName[^"]*"[^>]*>((?:(?!<\/h2>).)*)<\/h2>/g;
const WX_STRING = /<div [^>]*class="[^"]*DetailsSummary--condition[^"]*"[^>]*>((?:(?!<\/div>).)*)<\/div>/g;
const TEMPERATURE = /<div [^>]*class="[^"]*DetailsSummary--temperature[^"]*"[^>]*>((?:(?!<\/div>).)*)<\/div>/g;
const PRECIPITATION = /<div [^>]*class="[^"]*DetailsSummary--precip[^"]*"[^>]*>((?:(?!<\/div>).)*)<\/div>/g;
const WIND = /<div [^>]*class="[^"]*DetailsSummary--wind[^"]*"[^>]*>((?:(?!<\/div>).)*)<\/div>/g;
const NON_TEXT = /<svg[^>]*>(?:(?!<\/svg>).)*<\/svg>|<\/?[a-z\-]+[^>]*>|\t/g;
const PROPERTIES = [
    [TIME, "time"],
    [WX_STRING, "wxString"],
    [TEMPERATURE, "temp"],
    [PRECIPITATION, "precip"],
    [WIND, "wind"]
];

async function getHourByHour(placeId) {
    const arr = [];
    const url = new URL(`https://weather.com/weather/hourbyhour/l/${encodeURIComponent(placeId)}`);
    const res = await fetch(url);
    let html = await res.text();
    html = html.replace(/\r|\n/g, "");
    let match;
    while ((match = DETAIL.exec(html)) != null) {
        const details = match[1] || "";
        const obj = {};
        for (const [regex, key] of PROPERTIES) {
            match = details.match(regex) || [];
            let value = match[0] || "";
            value = value.replaceAll(NON_TEXT, "");
            obj[key] = value;
        }
        arr.push(obj);
    }
    return arr;
}

export {
    getLocation,
    getHourByHour
};