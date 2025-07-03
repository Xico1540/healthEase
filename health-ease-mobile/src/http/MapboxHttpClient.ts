import AbstractHttpClient from "@/src/http/AbstractHttpClient";

interface Coordinates {
    latitude: number; // Latitude of the location.
    longitude: number; // Longitude of the location.
}

class MapboxHttpClient extends AbstractHttpClient<null> {
    private static instance: MapboxHttpClient; // Singleton instance of the MapboxHttpClient.

    // Mapbox API access token for authentication.
    private accessToken: string = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

    /**
     * Private constructor to enforce singleton pattern.
     * @param baseUrl - The base URL for Mapbox API.
     */
    private constructor(baseUrl: string) {
        super(baseUrl);
    }

    /**
     * Returns the singleton instance of MapboxHttpClient.
     * If the instance does not exist, it is created.
     */
    public static getInstance(): MapboxHttpClient {
        if (!MapboxHttpClient.instance) {
            MapboxHttpClient.instance = new MapboxHttpClient("https://api.mapbox.com");
        }
        return MapboxHttpClient.instance;
    }

    /**
     * Prepares the HTTP headers for requests.
     * Defaults the content type to "application/json".
     */
    protected async getHeaders(contentType?: string): Promise<Headers> {
        const headers = new Headers();
        headers.append("Content-Type", contentType || "application/json");
        return Promise.resolve(headers);
    }

    /**
     * Fetches driving directions from a start location to an end location.
     * @param startLocation - Coordinates of the starting point.
     * @param endLocation - Coordinates of the destination point.
     * @returns A Promise that resolves with the API response.
     */
    public async getDirections(startLocation: Coordinates, endLocation: Coordinates): Promise<Response> {
        const endpoint = `directions/v5/mapbox/driving/${startLocation.longitude},${startLocation.latitude};${endLocation.longitude},${endLocation.latitude}?access_token=${this.accessToken}`;
        return this.get(endpoint);
    }

    /**
     * Fetches geocoding information for a given address.
     * Converts an address into geographic coordinates (latitude and longitude).
     * @param address - The address to geocode.
     * @returns A Promise that resolves with the API response.
     */
    public async getGeocoding(address: string): Promise<Response> {
        const endpoint = `geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${this.accessToken}`;
        return this.get(endpoint);
    }
}

export default MapboxHttpClient;
