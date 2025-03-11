declare function getWeatherForecast(lat: number, lng: number, city?: string, postalCode?: string): Promise<{
    time: string,
    temp: string,
    precip: string,
    wind: string
}[]>;

export {
    getWeatherForecast
};