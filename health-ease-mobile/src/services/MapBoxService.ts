import MapboxHttpClient from "@/src/http/MapboxHttpClient";

export interface Waypoint {
    distance: number;
    location: [number, number];
    name: string;
}

export interface Route {
    distance: number;
    duration: number;
    geometry: string;
    legs: any[];
    weight: number;
    weight_name: string;
}

export interface DirectionsResponse {
    code: string;
    routes: Route[];
    uuid: string;
    waypoints: Waypoint[];
}

export interface GeocodingResponse {
    type: string;
    query: string[];
    features: {
        id: string;
        type: string;
        place_type: string[];
        relevance: number;
        properties: Record<string, any>;
        text: string;
        place_name: string;
        center: [number, number];
        geometry: {
            type: string;
            coordinates: [number, number];
        };
    }[];
}

class MapboxService {
    private static instance: MapboxService;

    private mapboxHttpClient = MapboxHttpClient.getInstance();

    public static getInstance(): MapboxService {
        if (!MapboxService.instance) {
            MapboxService.instance = new MapboxService();
        }
        return MapboxService.instance;
    }

    public async fetchDirections(
        startLocation: { latitude: number; longitude: number },
        endLocation: { latitude: number; longitude: number },
    ): Promise<DirectionsResponse> {
        const response = await this.mapboxHttpClient.getDirections(startLocation, endLocation);
        if (!response.ok) {
            throw new Error("Failed to fetch directions");
        }
        return response.json();
    }

    public async fetchCoordinates(address: string): Promise<[number, number]> {
        const response = await this.mapboxHttpClient.getGeocoding(address);
        if (!response.ok) {
            throw new Error("Failed to fetch coordinates");
        }
        const data: GeocodingResponse = await response.json();
        if (data.features.length === 0) {
            throw new Error("No coordinates found for the given address");
        }
        return data.features[0].center;
    }
}

export default MapboxService;
