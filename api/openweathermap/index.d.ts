declare interface HourlyForecastData {
    /**
     * Internal parameter
     */
    cod: string;
    /**
     * Internal parameter
     */
    message: number;
    /**
     * Number of timestamps returned by this API call
     */
    cnt: number;
    list: {
        /**
         * Time of data forecasted, Unix, UTC
         */
        dt: number;
        main: {
            /**
             * Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
             */
            temp: number;
            /**
             * This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
             */
            feels_like: number;
            /**
             * Minimum temperature at the moment of calculation. This is minimal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. Please find more info {@link https://openweathermap.org/api/hourly-forecast#min here}. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
             */
            temp_min: number;
            /**
             * Maximum temperature at the moment of calculation. This is maximal forecasted temperature (within large megalopolises and urban areas), use these parameter optionally. Please find more info {@link https://openweathermap.org/api/hourly-forecast#min here}. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
             */
            temp_max: number;
            /**
             * Atmospheric pressure on the sea level by default, hPa
             */
            pressure: number;
            /**
             * Atmospheric pressure on the sea level, hPa
             */
            sea_level: number;
            /**
             *  Atmospheric pressure on the ground level, hPa
             */
            grnd_level: number;
            /**
             * Humidity, %
             */
            humidity: number;
            /**
             * Internal parameter
             */
            temp_kf: number;
        };
        weather: [
            {
                /**
                 * Weather condition id
                 */
                id: number;
                /**
                 * Group of weather parameters (Rain, Snow, Clouds etc.)
                 */
                main: string;
                /**
                 * Weather condition within the group. Please find more {@link https://openweathermap.org/api/hourly-forecast#list here}.
                 */
                description: string;
                /**
                 * Weather icon id
                 */
                icon: string;
            }
        ];
        clouds: {
            /**
             * Cloudiness, %
             */
            all: number;
        };
        wind: {
            /**
             * Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour
             */
            speed: number;
            /**
             * Wind direction, degrees (meteorological)
             */
            deg: number;
            /**
             * Wind gust. Units – default: metre/sec, metric: metre/sec, imperial: miles/hour
             */
            gust: number;
        };
        /**
         * Average visibility, metres. The maximum value of the visibility is 10km
         */
        visibility: number;
        /**
         * Probability of precipitation. The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100%
         */
        pop: number;
        rain: {
            /**
             * Rain volume for last hour, mm. Please note that only mm as units of measurement are available for this parameter
             */
            "1h": number;
        };
        snow?: {
            /**
             * Snow volume for last hour, mm. Please note that only mm as units of measurement are available for this parameter
             */
            "1h": number;
        }
        sys: {
            /**
             * Part of the day (n - night, d - day)
             */
            pod: "d" | "n";
        };
        /**
         * Time of data forecasted, ISO, UTC
         */
        dt_txt: "2022-08-30 16:00:00"
    }[];
    /**
     * @deprecated
     */
    city?: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    }
}

/**
 * @param lat Latitude
 * @param lng Longitude
 */
declare function getHourlyForecastData(lat: number, lng: number): Promise<HourlyForecastData>;

export {
    HourlyForecastData,
    getHourlyForecastData
};