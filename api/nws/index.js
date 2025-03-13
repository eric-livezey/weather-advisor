import { request } from "../utils.js";

const NWSForecastOfficeId = Object.freeze({
    AKQ: "AKQ",
    ALY: "ALY",
    BGM: "BGM",
    BOX: "BOX",
    BTV: "BTV",
    BUF: "BUF",
    CAE: "CAE",
    CAR: "CAR",
    CHS: "CHS",
    CLE: "CLE",
    CTP: "CTP",
    GSP: "GSP",
    GYX: "GYX",
    ILM: "ILM",
    ILN: "ILN",
    LWX: "LWX",
    MHX: "MHX",
    OKX: "OKX",
    PBZ: "PBZ",
    PHI: "PHI",
    RAH: "RAH",
    RLX: "RLX",
    RNK: "RNK",
    ABQ: "ABQ",
    AMA: "AMA",
    BMX: "BMX",
    BRO: "BRO",
    CRP: "CRP",
    EPZ: "EPZ",
    EWX: "EWX",
    FFC: "FFC",
    FWD: "FWD",
    HGX: "HGX",
    HUN: "HUN",
    JAN: "JAN",
    JAX: "JAX",
    KEY: "KEY",
    LCH: "LCH",
    LIX: "LIX",
    LUB: "LUB",
    LZK: "LZK",
    MAF: "MAF",
    MEG: "MEG",
    MFL: "MFL",
    MLB: "MLB",
    MOB: "MOB",
    MRX: "MRX",
    OHX: "OHX",
    OUN: "OUN",
    SHV: "SHV",
    SJT: "SJT",
    SJU: "SJU",
    TAE: "TAE",
    TBW: "TBW",
    TSA: "TSA",
    ABR: "ABR",
    APX: "APX",
    ARX: "ARX",
    BIS: "BIS",
    BOU: "BOU",
    CYS: "CYS",
    DDC: "DDC",
    DLH: "DLH",
    DMX: "DMX",
    DTX: "DTX",
    DVN: "DVN",
    EAX: "EAX",
    FGF: "FGF",
    FSD: "FSD",
    GID: "GID",
    GJT: "GJT",
    GLD: "GLD",
    GRB: "GRB",
    GRR: "GRR",
    ICT: "ICT",
    ILX: "ILX",
    IND: "IND",
    IWX: "IWX",
    JKL: "JKL",
    LBF: "LBF",
    LMK: "LMK",
    LOT: "LOT",
    LSX: "LSX",
    MKX: "MKX",
    MPX: "MPX",
    MQT: "MQT",
    OAX: "OAX",
    PAH: "PAH",
    PUB: "PUB",
    RIW: "RIW",
    SGF: "SGF",
    TOP: "TOP",
    UNR: "UNR",
    BOI: "BOI",
    BYZ: "BYZ",
    EKA: "EKA",
    FGZ: "FGZ",
    GGW: "GGW",
    HNX: "HNX",
    LKN: "LKN",
    LOX: "LOX",
    MFR: "MFR",
    MSO: "MSO",
    MTR: "MTR",
    OTX: "OTX",
    PDT: "PDT",
    PIH: "PIH",
    PQR: "PQR",
    PSR: "PSR",
    REV: "REV",
    SEW: "SEW",
    SGX: "SGX",
    SLC: "SLC",
    STO: "STO",
    TFX: "TFX",
    TWC: "TWC",
    VEF: "VEF",
    AER: "AER",
    AFC: "AFC",
    AFG: "AFG",
    AJK: "AJK",
    ALU: "ALU",
    GUM: "GUM",
    HPA: "HPA",
    HFO: "HFO",
    PPG: "PPG",
    STU: "STU",
    NH1: "NH1",
    NH2: "NH2",
    ONA: "ONA",
    ONP: "ONP"
});

/**
 * @type {typeof import("./index").GridpointForecastUnits}
 */
const GridpointForecastUnits = Object.freeze({
    US: "us",
    SI: "si"
});

const BASE_URL = "https://api.weather.gov";
const BASE_HEADERS = {
    "Accept": "application/geo+json"
}

/**
 * @param {string} endpoint 
 * @param {import("../utils").RequestOptions} options 
 */
async function requestAPI(endpoint, options) {
    options = options || {};
    const params = { ...options.params };
    const headers = { ...BASE_HEADERS, ...options.headers }
    return await request(BASE_URL, endpoint, { params, headers });
}

/**
 * @type {import("./index").getStations}
 */
async function getStations(params) {
    return await requestAPI("/stations", params);
}

/**
 * @type {import("./index").getAllStations}
 */
async function getAllStations(params) {
    params = params || {};
    params.limit = 500;
    const result = await getStations(params);
    let len = result.features.length;
    while (result.pagination && len === params.limit) {
        const url = new URL(result.pagination.next);
        const page = await requestAPI(url.pathname, url.searchParams);
        result.features.push(...page.features);
        if (result.observationStations && page.observationStations)
            result.observationStations.push(...page.observationStations);
        result.pagination = page.pagination;
        len = page.features.length;
    }
    return result;
}

/**
 * @type {import("./index").getStationObservations}
 */
async function getStationObservations(stationId, params) {
    return await requestAPI(`/stations/${stationId}/observations`, { params });
}

/**
 * @type {import("./index").getStationObservationsLatest}
 */
async function getStationObservationsLatest(stationId, params) {
    return await requestAPI(`/stations/${stationId}/observations/latest`, { params });
}

/**
 * @type {import("./index").getStationObservationsTime}
 */
async function getStationObservationsTime(stationId, time) {
    return await requestAPI(`/stations/${stationId}/observations/${encodeURIComponent(time)}`);
}

/**
 * @type {import("./index").getGridpointForecastHourly}
 */
async function getGridpointForecastHourly(wfo, x, y, params, featureFlags) {
    const headers = {};
    if (featureFlags) {
        headers["Feature-Flags"] = featureFlags.join(", ");
    }
    return await requestAPI(`/gridpoints/${wfo}/${x},${y}/forecast/hourly`, { params, headers });
}

/**
 * @type {import("./index").getGridpointStations}
 */
async function getGridpointStations(wfo, x, y, params) {
    return await requestAPI(`/gridpoints/${wfo}/${x},${y}/stations`, { params });
}

/**
 * @type {import("./index").getPoint}
 */
async function getPoint(lat, lng) {
    const point = `${lat},${lng}`;
    return await requestAPI(`/points/${encodeURIComponent(point)}`);
}

export {
    NWSForecastOfficeId,
    GridpointForecastUnits,
    getStations,
    getAllStations,
    getStationObservations,
    getStationObservationsLatest,
    getStationObservationsTime,
    getGridpointForecastHourly,
    getGridpointStations,
    getPoint
};