import { Connection, FieldInfo, GeometryType, QueryOptions } from "mysql";
import { ForecastHourly2Day } from "../api/ibm";
import { WeatherOverviewResponse } from "../api/msn";
import { GridpointForecast } from "../api/nws";

declare enum ForecastProviderType {
    NWS = 0,
    IBM = 1,
    MSN = 2,
    ACCUWEATHER = 3
}

declare interface ForecastDataTypes {
    [ForecastProviderType.NWS]: GridpointForecast;
    [ForecastProviderType.IBM]: ForecastHourly2Day;
    [ForecastProviderType.MSN]: WeatherOverviewResponse;
    [ForecastProviderType.ACCUWEATHER]: {
        time: string,
        temp: string,
        precip: string,
        wind: string
    }[];
}

declare interface Location {
    id: number;
    coordinates: GeometryType;
    station_id: string;
    address: string;
}

declare interface Observation {
    station_id: string;
    timestamp: Date;
    temperature: number;
    precipitation: number;
    wind_speed: number;
}

declare interface Forecast {
    location: number;
    provider: ForecastProviderType;
    timestamp: Date;
    hour: number;
    temperature: number;
    precipitation: number;
    wind_speed: number;
}

declare interface QueryResponse<T = any> {
    results: T;
    fields?: FieldInfo[];
}

declare function query(conn: Connection, options: string | QueryOptions): Promise<QueryResponse>;

declare function insertForecasts<T extends ForecastProviderType>(conn: Connection, provider: T, data: ForecastDataTypes[T], location: Location, date: Date): Promise<QueryResponse>;

export {
    ForecastProviderType,
    ForecastDataTypes,
    Location,
    Observation,
    Forecast,
    QueryResponse,
    query,
    insertForecasts
};