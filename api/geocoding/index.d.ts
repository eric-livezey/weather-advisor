import { GeocodeResult } from "@googlemaps/google-maps-services-js";

declare function geocode(address: string): Promise<GeocodeResult | null>;

export {
    geocode
};