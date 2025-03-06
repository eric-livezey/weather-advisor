/**
 * For scraping weather directly from accuweather
 */

// const BASE_URL = "https://weather.com/api/v1/p";

// async function request(endpoint, payload) {
//     const url = new URL(BASE_URL + endpoint);
//     const headers = {
//         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
//         "Origin": "https://weather.com",
//         "Referrer": "https://weather.com/",
//         "Content-Type": "application/json"
//     };
//     const res = await fetch(url, { method: "POST", body: Buffer.from(JSON.stringify(payload)), headers });
//     if (res.ok)
//         return await res.json();
//     else
//         throw new Error(`${res.status} ${res.statusText}`);
// }

// async function getLocation(query) {
//     const payload = [
//         {
//             name: "getSunV3LocationSearchUrlConfig",
//             params: {
//                 query,
//                 language: "en-US",
//                 locationType: "locale"
//             }
//         }
//     ]
//     const res = await request("/redux-dal", payload);
//     const config = payload[0];
//     const key = Object.entries(config.params).sort(([k1], [k2]) => k1.localeCompare(k2)).map(([k, v]) => `${k}:${v}`).join(";");
//     return res.dal[config.name][key];
// }

const ITEM = /<a [^>]*class="[^"]*hourly-list__list__item[^"]*"[^>]*>((?:(?!<\/a>).)*)<\/a>/g;
const TIME = /<span [^>]*class="[^"]*hourly-list__list__item-time[^"]*"[^>]*>((?:(?!<\/span>).)*)<\/span>/g;
const TEMPERATURE = /<span [^>]*class="[^"]*hourly-list__list__item-temp[^"]*"[^>]*>((?:(?!<\/span>).)*)<\/span>/g;
const PRECIPITATION = /<div [^>]*class="[^"]*hourly-list__list__item-precip[^"]*"[^>]*>((?:(?!<\/div>).)*)<\/div>/g;
const NON_TEXT = /<svg[^>]*>(?:(?!<\/svg>).)*<\/svg>|<\/?[a-z\-]+[^>]*>|\t/g;
const PROPERTIES = [
    [TIME, "time"],
    [TEMPERATURE, "temp"],
    [PRECIPITATION, "precip"]
];

async function getWeatherForecast(lat, lng, city, postalCode) {
    const arr = [];
    const url = new URL(`https://www.accuweather.com/web-api/three-day-redirect`);
    url.searchParams.set("key", `GEO_${lng},${lat}`);
    url.searchParams.set("city", city || "");
    url.searchParams.set("postalCode", postalCode || "");
    const res = await fetch(url);
    let html = await res.text();
    html = html.replace(/\r|\n/g, "");
    let match;
    while ((match = ITEM.exec(html)) != null) {
        const details = match[1] || "";
        const obj = {};
        for (const [regex, key] of PROPERTIES) {
            match = details.match(regex);
            let value = match[0] || "";
            value = value.replaceAll(NON_TEXT, "");
            obj[key] = value;
        }
        arr.push(obj);
    }
    return arr;
}

export {
    getWeatherForecast
};