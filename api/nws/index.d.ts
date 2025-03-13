declare type JsonLdContext = Record<string, string> | Record<string, string>[];

declare type GeoJsonBoundingBox = number[];

declare type GeoJsonCoordinate = number[];

declare type GeoJsonLineString = GeoJsonCoordinate[];

declare type GeoJsonPolygon = GeoJsonCoordinate[][];

declare type GeoJsonGeometry = {
    type: "Point";
    coordinates: GeoJsonCoordinate;
    bbox?: GeoJsonBoundingBox;
}
    |
{
    type: "LineString";
    coordinates: GeoJsonLineString;
    bbox?: GeoJsonBoundingBox;
}
    |
{
    type: "Polygon";
    coordinates: GeoJsonPolygon;
    bbox?: GeoJsonBoundingBox;
}
    |
{
    type: "MultiPoint";
    coordinates: GeoJsonCoordinate[];
    bbox?: GeoJsonBoundingBox;
}
    |
{
    type: "MultiLineString";
    coordinates: GeoJsonLineString[];
    bbox?: GeoJsonBoundingBox;
}
    |
{
    type: "MultiPolygon";
    coordinates: GeoJsonPolygon[];
    bbox?: GeoJsonBoundingBox;
};

declare interface GeoJsonFeature<T = {}> {
    "@context"?: JsonLdContext;
    id?: string;
    type: "Feature";
    geometry: GeoJsonGeometry;
    properties: T;
}

declare interface GeoJsonFeatureCollection<T> {
    "@context"?: JsonLdContext;
    type: "FeatureCollection";
    features: GeoJsonFeature<T>[];
}

declare enum NWSForecastOfficeId {
    AKQ = "AKQ",
    ALY = "ALY",
    BGM = "BGM",
    BOX = "BOX",
    BTV = "BTV",
    BUF = "BUF",
    CAE = "CAE",
    CAR = "CAR",
    CHS = "CHS",
    CLE = "CLE",
    CTP = "CTP",
    GSP = "GSP",
    GYX = "GYX",
    ILM = "ILM",
    ILN = "ILN",
    LWX = "LWX",
    MHX = "MHX",
    OKX = "OKX",
    PBZ = "PBZ",
    PHI = "PHI",
    RAH = "RAH",
    RLX = "RLX",
    RNK = "RNK",
    ABQ = "ABQ",
    AMA = "AMA",
    BMX = "BMX",
    BRO = "BRO",
    CRP = "CRP",
    EPZ = "EPZ",
    EWX = "EWX",
    FFC = "FFC",
    FWD = "FWD",
    HGX = "HGX",
    HUN = "HUN",
    JAN = "JAN",
    JAX = "JAX",
    KEY = "KEY",
    LCH = "LCH",
    LIX = "LIX",
    LUB = "LUB",
    LZK = "LZK",
    MAF = "MAF",
    MEG = "MEG",
    MFL = "MFL",
    MLB = "MLB",
    MOB = "MOB",
    MRX = "MRX",
    OHX = "OHX",
    OUN = "OUN",
    SHV = "SHV",
    SJT = "SJT",
    SJU = "SJU",
    TAE = "TAE",
    TBW = "TBW",
    TSA = "TSA",
    ABR = "ABR",
    APX = "APX",
    ARX = "ARX",
    BIS = "BIS",
    BOU = "BOU",
    CYS = "CYS",
    DDC = "DDC",
    DLH = "DLH",
    DMX = "DMX",
    DTX = "DTX",
    DVN = "DVN",
    EAX = "EAX",
    FGF = "FGF",
    FSD = "FSD",
    GID = "GID",
    GJT = "GJT",
    GLD = "GLD",
    GRB = "GRB",
    GRR = "GRR",
    ICT = "ICT",
    ILX = "ILX",
    IND = "IND",
    IWX = "IWX",
    JKL = "JKL",
    LBF = "LBF",
    LMK = "LMK",
    LOT = "LOT",
    LSX = "LSX",
    MKX = "MKX",
    MPX = "MPX",
    MQT = "MQT",
    OAX = "OAX",
    PAH = "PAH",
    PUB = "PUB",
    RIW = "RIW",
    SGF = "SGF",
    TOP = "TOP",
    UNR = "UNR",
    BOI = "BOI",
    BYZ = "BYZ",
    EKA = "EKA",
    FGZ = "FGZ",
    GGW = "GGW",
    HNX = "HNX",
    LKN = "LKN",
    LOX = "LOX",
    MFR = "MFR",
    MSO = "MSO",
    MTR = "MTR",
    OTX = "OTX",
    PDT = "PDT",
    PIH = "PIH",
    PQR = "PQR",
    PSR = "PSR",
    REV = "REV",
    SEW = "SEW",
    SGX = "SGX",
    SLC = "SLC",
    STO = "STO",
    TFX = "TFX",
    TWC = "TWC",
    VEF = "VEF",
    AER = "AER",
    AFC = "AFC",
    AFG = "AFG",
    AJK = "AJK",
    ALU = "ALU",
    GUM = "GUM",
    HPA = "HPA",
    HFO = "HFO",
    PPG = "PPG",
    STU = "STU",
    NH1 = "NH1",
    NH2 = "NH2",
    ONA = "ONA",
    ONP = "ONP"
}

declare enum GridpointForecastUnits {
    US = "us",
    SI = "si"
}

/**
 * A structured value representing a measurement and its unit of measure. This object is a slighly modified version of the schema.org definition at https://schema.org/QuantitativeValue
 */
declare interface QuantitativeValue {
    /**
     * A measured value
     */
    value?: number | null;
    /**
     * The maximum value of a range of measured values
     */
    maxValue?: number;
    /**
     * The minimum value of a range of measured values
     */
    minValue?: number;
    /**
     * A string denoting a unit of measure, expressed in the format "{unit}" or "{namespace}:{unit}".
     * 
     * Units with the namespace "wmo" or "wmoUnit" are defined in the World Meteorological Organization Codes Registry at http://codes.wmo.int/common/unit and should be canonically resolvable to http://codes.wmo.int/common/unit/{unit}.
     * 
     * Units with the namespace "nwsUnit" are currently custom and do not align to any standard. Units with no namespace or the namespace "uc" are compliant with the Unified Code for Units of Measure syntax defined at https://unitsofmeasure.org/. This also aligns with recent versions of the Geographic Markup Language (GML) standard, the IWXXM standard, and OGC Observations and Measurements v2.0 (ISO/DIS 19156).
     * 
     * Namespaced units are considered deprecated. We will be aligning API to use the same standards as GML/IWXXM in the future.
     */
    unitCode?: string;
    /**
     * For values in observation records, the quality control flag from the MADIS system. The definitions of these flags can be found at https://madis.ncep.noaa.gov/madis_sfc_qc_notes.shtml
     */
    qualityControl?: "Z" | "C" | "S" | "V" | "X" | "Q" | "G" | "B" | "T";
}

declare interface PaginationInfo {
    /**
     * A link to the next page of records.
     */
    next: string;
}

declare interface RelativeLocation {
    city?: string;
    state?: string;
    distance?: QuantitativeValue;
    bearing?: QuantitativeValue;
}

declare type RelativeLocationGeoJSON = GeoJsonFeature<RelativeLocation>;


declare interface ObservationStation {
    "@context"?: JsonLdContext;
    /**
     * A geometry represented in Well-Known Text (WKT) format.
     */
    geometry?: string | null;
    "@id"?: string;
    "@type"?: "wx:ObservationStation";
    elevation?: QuantitativeValue;
    stationIdentifier?: string;
    name?: string;
    timeZone?: string;
    /**
     * A link to the NWS public forecast zone containing this station.
     */
    forecast?: string;
    /**
     * A link to the NWS county zone containing this station.
     */
    county?: string;
    /**
     * A link to the NWS fire weather forecast zone containing this station.
     */
    fireWeatherZone?: string;
}

declare interface ObservationStationCollectionGeoJson extends GeoJsonFeatureCollection<ObservationStation> {
    observationStations?: string[];
    pagination?: PaginationInfo;
}

declare interface MetarPhenomenon {
    intensity: "light" | "heavy" | null;
    modifier: "patches" | "blowing" | "low_drifting" | "freezing" | "shallow" | "partial" | "showers" | null;
    weather: "fog_mist" | "dust_storm" | "dust" | "drizzle" | "funnel_cloud" | "fog" | "smoke" | "hail" | "snow_pellets" | "haze" | "ice_crystals" | "ice_pellets" | "dust_whirls" | "spray" | "rain" | "sand" | "snow_grains" | "snow" | "squalls" | "sand_storm" | "thunderstorms" | "unknown" | "volcanic_ash" | null;
    rawString: string;
    inVicinity?: boolean;
}

declare interface Observation {
    "@context"?: JsonLdContext;
    /**
     * A geometry represented in Well-Known Text (WKT) format.
     */
    geometry?: string | null;
    "@id"?: string;
    "@type"?: "wx:ObservationStation";
    elevation?: QuantitativeValue;
    station?: string;
    timestamp?: string;
    rawMessage?: string;
    textDescription?: string;
    presentWeather?: MetarPhenomenon[];
    temperature?: QuantitativeValue;
    dewpoint?: QuantitativeValue;
    windDirection?: QuantitativeValue;
    windSpeed?: QuantitativeValue;
    windGust?: QuantitativeValue;
    barometricPressure?: QuantitativeValue;
    seaLevelPressure?: QuantitativeValue;
    visibility?: QuantitativeValue;
    maxTemperatureLast24Hours?: QuantitativeValue;
    minTemperatureLast24Hours?: QuantitativeValue;
    precipitationLastHour?: QuantitativeValue;
    precipitationLast3Hours?: QuantitativeValue;
    precipitationLast6Hours?: QuantitativeValue;
    relativeHumidity?: QuantitativeValue;
    windChill?: QuantitativeValue;
    heatIndex?: QuantitativeValue;
    cloudLayers?: {
        base: QuantitativeValue;
        amount: "OVC" | "BKN" | "SCT" | "FEW" | "SKC" | "CLR" | "VV";
    } | null;
}

declare type ObservationCollectionGeoJson = GeoJsonFeatureCollection<Observation>;

/**
 * An object containing forecast information for a specific time period (generally 12-hour or 1-hour).
 */
declare interface GridpointForecastPeriod {
    /**
     * Sequential period number.
     */
    number?: number;
    /**
     * A textual identifier for the period. This value will not be present for hourly forecasts.
     */
    name?: string;
    /**
     * The starting time that this forecast period is valid for.
     */
    startTime?: string;
    /**
     * The ending time that this forecast period is valid for.
     */
    endTime?: string;
    /**
     * Indicates whether this period is daytime or nighttime.
     */
    isDaytime?: boolean;
    /**
     * High/low temperature for the period, depending on whether the period is day or night.
     * 
     * This property as an integer value is deprecated. Future versions will express this value as a quantitative value object. To make use of the future standard format now, set the "forecast_temperature_qv" feature flag on the request.
     */
    temperature?: QuantitativeValue | number;
    /**
     * The unit of the temperature value (Fahrenheit or Celsius).
     * 
     * @deprecated Future versions will indicate the unit within the quantitative value object for the temperature property. To make use of the future standard format now, set the "forecast_temperature_qv" feature flag on the request.
     */
    temperatureUnit?: "F" | "C";
    /**
     * If not null, indicates a non-diurnal temperature trend for the period (either rising temperature overnight, or falling temperature during the day)
     */
    temperatureTrend?: "rising" | "falling" | null;
    probabilityOfPrecipitation?: QuantitativeValue;
    dewpoint?: QuantitativeValue;
    relativeHumidity?: QuantitativeValue;
    /**
     * 	Wind speed for the period.
     * 
     * This property as an string value is deprecated. Future versions will express this value as a quantitative value object. To make use of the future standard format now, set the "forecast_wind_speed_qv" feature flag on the request.
     */
    windSpeed?: QuantitativeValue | string;
    /**
     * Peak wind gust for the period.
     * 
     * This property as an string value is deprecated. Future versions will express this value as a quantitative value object. To make use of the future standard format now, set the "forecast_wind_speed_qv" feature flag on the request.
     */
    windGust?: QuantitativeValue | string;
    /**
     * The prevailing direction of the wind for the period, using a 16-point compass.
     */
    windDirection?: "N" | "NNE" | "NE" | "ENE" | "E" | "ESE" | "SE" | "SSE" | "S" | "SSW" | "SW" | "WSW" | "W" | "WNW" | "NW" | "NNW";
    /**
     * A link to an icon representing the forecast summary.
     * 
     * @deprecated
     */
    icon?: string;
    /**
     * A brief textual forecast summary for the period.
     */
    shortForecast?: string;
    /**
     * A detailed textual forecast for the period.
     */
    detailedForecast?: string;
}

/**
 * A multi-day forecast for a 2.5km grid square.
 */
declare interface GridpointForecast {
    "@context"?: JsonLdContext;
    /**
     * A geometry represented in Well-Known Text (WKT) format.
     */
    geometry?: string | null;
    /**
     * Denotes the units used in the textual portions of the forecast.
     */
    units?: GridpointForecastUnits;
    /**
     * The internal generator class used to create the forecast text (used for NWS debugging).
     */
    forecastGenerator?: string;
    /**
     * The time this forecast data was generated.
     */
    generatedAt?: string;
    /**
     * The last update time of the data this forecast was generated from.
     */
    updateTime?: string;
    /**
     * A time interval in ISO 8601 format. This can be one of:
     * 
     * 1. Start and end time
     * 2. Start time and duration
     * 3. Duration and end time
     * 
     * The string "NOW" can also be used in place of a start/end time.
     */
    validTimes?: string;
    /**
     * An array of forecast periods.
     */
    periods?: GridpointForecastPeriod[];
}

declare type GridpointForecastGeoJson = GeoJsonFeature<GridpointForecast>;

declare interface Point {
    "@context"?: JsonLdContext;
    /**
     * A geometry represented in Well-Known Text (WKT) format.
     */
    geometry?: string | null;
    "@id"?: string;
    "@type"?: "wx:Point";
    /**
     * Three-letter identifier for a NWS office.
     */
    cwa?: NWSForecastOfficeId;
    forecastOffice?: string;
    /**
     * Three-letter identifier for a NWS office.
     */
    gridId?: NWSForecastOfficeId;
    gridX?: number;
    gridY?: number;
    forecast?: string;
    forecastHourly?: string;
    forecastGridData?: string;
    observationStations?: string;
    relativeLocation?: RelativeLocationGeoJSON;
    forecastZone?: string;
    county?: string;
    fireWeatherZone?: string;
    timeZone?: string;
    radarStation?: string;
}

declare type PointGeoJson = GeoJsonFeature<Point>;

declare function getStations(params?: {
    id?: string | string[];
    state?: string | string[];
    limit?: number;
    cursor?: string;
}): Promise<ObservationStationCollectionGeoJson>;

declare function getAllStations(params?: {
    id?: string | string[];
    state?: string | string[];
}): Promise<ObservationStationCollectionGeoJson>;

declare function getStationObservations(stationId: string, params?: {
    start?: string;
    end?: string;
    limit?: number;
}): Promise<ObservationCollectionGeoJson>;

declare function getStationObservationsLatest(stationId: string, params?: {
    require_qc?: boolean;
}): Promise<ObservationCollectionGeoJson>;

declare function getStationObservationsTime(stationId: string, time: string): Promise<ObservationCollectionGeoJson>;

/**
 * Returns a textual hourly forecast for a 2.5km grid area
 * 
 * @param wfo Forecast office ID
 * @param x Forecast grid X coordinate
 * @param y Forecast grid Y coordinate
 * @param featureFlags Enable future and experimental features (see documentation for more info):
 * 
 * - `forecast_temperature_qv`: Represent temperature as QuantitativeValue
 * - `forecast_wind_speed_qv`: Represent wind speed as QuantitativeValue
 */
declare function getGridpointForecastHourly(wfo: NWSForecastOfficeId, x: number, y: number, params?: {
    /**
     * Use US customary or SI (metric) units in textual output
     */
    units?: GridpointForecastUnits;
}, featureFlags?: ("forecast_temperature_qv" | "forecast_wind_speed_qv")[]): Promise<GridpointForecastGeoJson>;

/**
 * Returns a list of observation stations usable for a given 2.5km grid area
 * 
 * @param wfo Forecast office ID
 * @param x Forecast grid X coordinate
 * @param y Forecast grid Y coordinate
 */
async function getGridpointStations(wfo: NWSForecastOfficeId, x: number, y: number, params?: {
    /**
     * Limit
     */
    limit?: number;
    /**
     * Pagination cursor
     */
    cursor?: string;
}): Promise<ObservationStationCollectionGeoJson>;

/**
 * Returns metadata about a given latitude/longitude point
 * 
 * @param lat latitude
 * @param lng longitude
 */
declare function getPoint(lat: number, lng: number): Promise<PointGeoJson>;

export {
    JsonLdContext,
    GeoJsonBoundingBox,
    GeoJsonCoordinate,
    GeoJsonLineString,
    GeoJsonPolygon,
    GeoJsonGeometry,
    GeoJsonFeature,
    GeoJsonFeatureCollection,
    NWSForecastOfficeId,
    GridpointForecastUnits,
    QuantitativeValue,
    PaginationInfo,
    RelativeLocation,
    RelativeLocationGeoJSON,
    ObservationStation,
    ObservationStationCollectionGeoJson,
    MetarPhenomenon,
    Observation,
    ObservationCollectionGeoJson,
    GridpointForecastPeriod,
    GridpointForecast,
    GridpointForecastGeoJson,
    Point,
    PointGeoJson,
    getStations,
    getAllStations,
    getStationObservations,
    getStationObservationsLatest,
    getStationObservationsTime,
    getGridpointForecastHourly,
    getGridpointStations,
    getPoint
};