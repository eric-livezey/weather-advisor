const BASE_URL = "https://api.weather.gov";

async function request(endpoint, params) {
    const url = new URL(BASE_URL + endpoint);
    for (const [key, value] of Object.entries(params))
        url.searchParams.append(key, value);
    const res = await fetch(url);
    if (res.ok)
        return await res.json();
    else
        throw new Error(`${res.status} ${res.statusText}`);
}

async function getStations(params) {
    return await request("/stations", params);
}

async function getAllStations(params) {
    params = params || {};
    params.limit = 500;
    const result = await getStations(params);
    let len = result.features.length;
    while (result.pagination && len === params.limit) {
        const url = new URL(result.pagination.next);
        const page = await request(url.pathname, url.searchParams);
        result.features.push(...page.features);
        if (result.observationStations && page.observationStations)
            result.observationStations.push(...page.observationStations);
        result.pagination = page.pagination;
        len = page.features.length;
    }
    return result;
}

async function getStationObservations(stationId, params) {
    return await request(`/stations/${stationId}/observations`, params);
}

async function getStationObservationsLatest(stationId, params) {
    return await request(`/stations/${stationId}/observations/latest`, params);
}

async function getStationObservationsTime(stationId, time) {
    return await request(`/stations/${stationId}/observations/${time}`);
}

export {
    getStations,
    getAllStations,
    getStationObservations,
    getStationObservationsLatest,
    getStationObservationsTime,
};