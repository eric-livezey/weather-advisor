declare interface ForecastHourly2Day {
    /**
     * Hourly average cloud cover expressed as a percentage.
     */
    cloudCover: number[];
    /**
     * Day of week.
     */
    dayOfWeek: string[];
    /**
     * This data field indicates whether it is daytime or nighttime based on the Local Apparent Time of the location.
     * 
     * D = Day, N = Night, X = missing (for extreme northern and southern hemisphere)
     */
    dayOrNight: string[];
    /**
     * Expiration time in UNIX seconds.
     */
    expirationTimeUtc: number[];
    /**
     * This number is the key to the weather icon lookup. The data field shows the icon number that is matched to represent the observed weather conditions.
     */
    iconCode: number[];
    /**
     * Code representing full set sensible weather.
     */
    iconCodeExtend: number[];
    /**
     * Hourly maximum probability of precipitation.
     */
    precipChance: number[];
    /**
     * The short text describing the expected type accumulation associated with the precipChance parameter.
     */
    precipType: string[];
    /**
     * Hourly mean sea level pressure.
     */
    pressureMeanSeaLevel: number[];
    /**
     * The forecasted measurable precipitation (liquid or liquid equivalent) for the upcoming hour. For example, if the local time is 8:35 am, the returned value would represent the timeframe of 9:00 am to 10:00 am.
     * 
     * Units - Expressed in inches
     */
    qpf: number[];
    /**
     * The forecasted hourly snow accumulation for the upcoming hour. For example, if the local time is 8:35 am, the returned value would represent the timeframe of 9:00 am to 10:00 am.
     * 
     * Units - Expressed in inches
     */
    qpfSnow: number[];
    /**
     * The relative humidity of the air, which is defined as the ratio of the amount of water vapor in the air to the amount of vapor required to bring the air to saturation at a constant temperature. Relative humidity is always expressed as a percentage.
     */
    relativeHumidity: number[];
    /**
     * The temperature of the air, measured by a thermometer 1.5 meters (4.5 feet) above the ground that is shaded from the other elements. You will receive this data field in Fahrenheit degrees or Celsius degrees.
     */
    temperature: number[];
    /**
     * The temperature to which air must be cooled at constant pressure to reach saturation. The Dew Point is also an indirect measure of the humidity of the air. The Dew Point will never exceed the Temperature. When the Dewpoint and Temperature are equal, clouds or fog will typically form. The closer the values of Temperature and Dew Point, the higher the relative humidity.
     */
    temperatureDewPoint: number[];
    /**
     * An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of the wind chill or heat index.
     * 
     * When the temperature is 65°F or higher, the Feels Like value represents the computed Heat Index. When the temperature is below 65°F, Feels Like value represents the computed Wind Chill.
     * 
     * Units - Expressed in fahrenheit
     * 
     * Range: -140 to 140
     */
    temperatureFeelsLike: (number | null)[];
    /**
     * An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of warm temperatures and high humidity.
     * 
     * Below 65°F, it is set = to the temperature.
     * 
     * Units - Expressed in fahrenheit
     */
    temperatureHeatIndex: number[];
    /**
     * An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of the cold temperatures and wind speed.
     * 
     * Above 65°F, it is set = to the temperature.
     * 
     * Units - Expressed in fahrenheit
     */
    temperatureWindChill: number[];
    /**
     * The UV Index Description which complements the UV Index value by providing an associated level of risk of skin damage due to exposure.
     * 
     * -2 = Not Available, -1 = No Report, 0 to 2 = Low, 3 to 5 = Moderate, 6 to 7 = High, 8 to 10 = Very High, 11 to 16 = Extreme
     */
    uvDescription: string[];
    /**
     * Hourly maximum UV index.
     */
    uvIndex: number[];
    /**
     * Time forecast is valid in local apparent time.
     */
    validTimeLocal: string[];
    /**
     * Time forecast is valid in UNIX seconds.
     */
    validTimeUtc: number[];
    /**
     * The horizontal visibility at the observation point. Visibilities can be reported as fractional values particularly when visibility is less than 2 miles. You can also find visibility values that equal zero. This occurrence is not wrong. Dense fog and heavy snows can produce values near zero. Fog, smoke, heavy rain and other weather phenomena can reduce visibility to near zero miles or kilometers.
     */
    visibility: number[];
    /**
     * Hourly average wind direction in magnetic notation.
     */
    windDirection: number[];
    /**
     * Hourly average wind direction in cardinal notation.
     */
    windDirectionCardinal: string[];
    /**
     * The maximum expected wind gust speed.
     */
    windGust: (number | null)[];
    /**
     * The forecast of the sustained wind speed at the top of the hour.
     * 
     * The wind is treated as a vector; hence, winds must have direction and magnitude (speed). The wind information reported in the hourly current conditions corresponds to a 10-minute average called the sustained wind speed. Sudden or brief variations in the wind speed are known as “wind gusts” and are reported in a separate data field. Wind directions are always expressed as "from whence the wind blows" meaning that a North wind blows from North to South. If you face North in a North wind the wind is at your face. Face southward and the North wind is at your back.
     */
    windSpeed: number[];
    /**
     * Hourly sensible weather phrase up to 32 characters.
     */
    wxPhraseLong: string[];
    /**
     * Hourly sensible weather phrase up to 12 characters.
     */
    wxPhraseShort: (string | null)[];
    /**
     * A number denoting how impactful is the forecasted weather for this hour. Can be used to determine the graphical treatment of the weather display such as using red font on weather.com.
     */
    wxSeverity: number[];
}

declare function getForecastHourly2Day(lat: string | number, lng: string | number): Promise<ForecastHourly2Day>;

export {
    getForecastHourly2Day
};