import { Connection, FieldInfo, GeometryType } from "mysql";
import { ForecastHourly2Day } from "../api/ibm";
import { WeatherOverviewResponse } from "../api/msn";

declare enum ForecastProviderType {
    IBM,
    MSN,
    ACCUWEATHER
}

declare interface Location {
    id: number;
    coordinates: GeometryType;
    address: string;
}

declare interface ForecastData {
    [ForecastProviderType.IBM]: ForecastHourly2Day;
    [ForecastProviderType.MSN]: WeatherOverviewResponse;
    [ForecastProviderType.ACCUWEATHER]: {
        time: string,
        temp: string,
        precip: string
    };
}

declare function insertForecasts<T extends ForecastProviderType>(conn: Connection, data: ForecastData[T], provider: T, location: Location): Promise<{
    results: any;
    fields: FieldInfo[] | undefined;
}>;

export {
    ForecastData,
    ForecastProviderType,
    insertForecasts,
    Location
};