declare function getLocation(query: string): Promise<{
    data: {
        location: {
            address: string[];
            adminDistrict: (string | null)[];
            adminDistrictCode: (string | null)[];
            city: string[];
            country: string[];
            countryCode: string[];
            displayName: string[];
            displayContext: string[];
            ianaTimeZone: string[];
            latitude: number[];
            longitude: number[];
            locale: {
                locale1: string | null;
                locale2: string | null;
                locale3: string | null;
                locale4: string | null;
            }[];
            neighborhood: (string | null)[];
            placeId: string[];
            postalCode: (string | null)[];
            postalKey: (string | null)[];
            disputedArea: boolean[];
            disputedCountries: (string | null)[];
            disputedCountryCodes: (string | null)[];
            disputedCustomers: (string | null)[];
            disputedShowCountry: boolean[][];
            iataCode: string[];
            icaoCode: string[];
            locId: string[];
            locationCategory: (string | null)[];
            pwsId: string[];
            type: string[]
        };
    };
    loaded: boolean;
    loading: boolean;
    status: number;
    statusText: string;
}>;

declare function getHourByHour(placeId: string): Promise<{
    time: string;
    wxString: string;
    temp: string;
    precip: string;
    wind: string;
}[]>;

export {
    getLocation,
    getHourByHour
};