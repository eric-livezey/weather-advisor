declare function getWeatherForecast(lat: number, lng: number, city?: string, postalCode?: string): Promise<{
    time: string,
    temperature: string,
    precipitation: string,
    wind: string
}[]>;

export {
    getWeatherForecast
};