/*
 * For scraping weather directly from accuweather
 */

const ITEM = /<div [^>]*class="[^"]*hour[^"]*"[^>]*>((?:(?!<\/p>(?:<\/div>){5}).)*)<\/p>(?:<\/div>){5}/g;
const TIME = /<h2 [^>]*class="[^"]*date[^"]*"[^>]*>((?:(?!<\/h2>).)*)<\/h2>/g;
const TEMPERATURE = /<div [^>]*class="[^"]*temp[^"]*"[^>]*>((?:(?!<\/div>).)*)<\/div>/g;
const PRECIPITATION = /<div [^>]*class="[^"]*precip[^"]*"[^>]*>((?:(?!<\/div>).)*)<\/div>/g;
const WIND = /<p>Wind((?:(?!<\/p>).)*)<\/p>/
const NON_TEXT = /<svg[^>]*>(?:(?!<\/svg>).)*<\/svg>|<\/?[a-z\-]+[^>]*>/g;
const PROPERTIES = [
    [TIME, "time"],
    [TEMPERATURE, "temp"],
    [PRECIPITATION, "precip"],
    [WIND, "wind"]
];

async function getWeatherForecast(lat, lng, city, postalCode) {
    const arr = [];
    // redirects to the weather overview page
    let url = new URL(`https://www.accuweather.com/web-api/three-day-redirect`);
    url.searchParams.set("key", `GEO_${lng},${lat}`);
    url.searchParams.set("city", city || "");
    url.searchParams.set("postalCode", postalCode || "");
    let res = await fetch(url);
    // changing the URL like this should give the url to the hourly forecast
    url = res.url.replace("/weather-forecast/", "/hourly-weather-forecast/");
    res = await fetch(url);
    let html = await res.text();
    html = html.replace(/\r|\n|\t/g, "");
    let match;
    while ((match = ITEM.exec(html)) != null) {
        const details = match[1] || "";
        const obj = {};
        for (const [regex, key] of PROPERTIES) {
            match = details.match(regex) || [];
            let value = match[1] || match[0] || "";
            value = value.trim();
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