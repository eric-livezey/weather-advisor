import { AddressType, Client } from "@googlemaps/google-maps-services-js";
import { existsSync, readFileSync, writeFileSync } from "fs";

const PATH = "api/geocoding/cache.json";
const CACHE = existsSync(PATH) ? JSON.parse(readFileSync(PATH).toString("utf8")) : {};
const VALID_TYPES = [AddressType.locality, AddressType.postal_code];
const CLIENT = new Client();

function cache(address, result) {
    CACHE[address] = result;
    writeFileSync(PATH, JSON.stringify(CACHE));
}

async function geocode(address) {
    address = address.toLowerCase();
    if (!(address in CACHE)) {
        const response = await CLIENT.geocode({ params: { key: process.env.GOOGLE_MAPS_API_KEY, address, components: { country: "US" } } });
        const result = response.data.results.length > 0 ? response.data.results[0] : null;
        // cache as null if the result type is not a valid type
        cache(address, result.types.some(type => VALID_TYPES.includes(type)) ? result : null);
    }
    return CACHE[address]
}

export {
    geocode
};