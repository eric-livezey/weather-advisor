/*
 * For scraping weather directly from accuweather
 */

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
            match = details.match(regex) || [];
            let value = match[0] || "";
            value = value.replaceAll(NON_TEXT, "");
            value = value.replaceAll("&#xB0;", "\u00b0");
            obj[key] = value;
        }
        arr.push(obj);
    }
    return arr;
}

export {
    getWeatherForecast
};