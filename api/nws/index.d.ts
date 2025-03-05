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

declare interface QuantitativeValue {
    value?: number | null;
    maxValue?: number;
    minValue?: number;
    unitCode?: string;
    qualityControl?: string;
}

declare interface PaginationInfo {
    /**
     * A link to the next page of records.
     */
    next: string;
}

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
        base: QuantitativeValue; amount: "OVC" | "BKN" | "SCT" | "FEW" | "SKC" | "CLR" | "VV"
    } | null;
}

declare type ObservationCollectionGeoJson = GeoJsonFeatureCollection<Observation>;

declare function getStations(params: {
    id: string | string[];
    state: string | string[];
    limit: number;
    cursor: string;
} | undefined): Promise<ObservationStationCollectionGeoJson>;

declare function getAllStations(params: {
    id: string | string[];
    state: string | string[];
} | undefined): Promise<ObservationStationCollectionGeoJson>;

declare function getStationObservations(stationId: string, params: {
    start?: string;
    end?: string;
    limit?: number;
} | undefined): Promise<ObservationCollectionGeoJson>;

declare function getStationObservationsLatest(stationId: string, params: {
    require_qc?: boolean;
} | undefined): Promise<ObservationCollectionGeoJson>;

declare function getStationObservationsTime(stationId: string, time: string): Promise<ObservationCollectionGeoJson>;

export {
    getStations,
    getAllStations,
    getStationObservations,
    getStationObservationsLatest,
    getStationObservationsTime
};