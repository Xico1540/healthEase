import { Resource } from "fhir/r4"; // Represents FHIR resources.
import AbstractHttpAuthClient from "@/src/http/AbstractAuthHttpClient"; // Base HTTP client class with authentication.
import AllowedFhirTypes from "@/src/model/AllowedFhirTypes"; // Enum defining allowed FHIR resource types.
import { AuthContextEnum } from "@/src/model/Authentication"; // Enum for authentication contexts.

class ResourceDataProviderHttpClient<T> extends AbstractHttpAuthClient<T> {
    private static instance: ResourceDataProviderHttpClient<Resource>; // Singleton instance.

    private baseEndpoint: string = "fhir"; // Base endpoint for FHIR API.

    private readonly authContext: AuthContextEnum; // Authentication context (e.g., CLIENT or USER).

    /**
     * Extends the parent class method to include headers for authenticated requests.
     * @param contentType - Optional Content-Type for the request.
     */
    protected async getHeaders(contentType?: string): Promise<Headers> {
        return super.getHeaders(this.authContext, contentType); // Includes auth context in headers.
    }

    /**
     * Private constructor to enforce singleton pattern.
     * @param baseURL - Base URL for the API.
     * @param authContext - Authentication context for the client.
     */
    private constructor(baseURL: string, authContext: AuthContextEnum) {
        super(baseURL);
        this.authContext = authContext;
    }

    /**
     * Returns a singleton instance of ResourceDataProviderHttpClient.
     * Ensures only one instance is created per authentication context.
     * @param authContext - Authentication context for the client.
     */
    public static getInstance(authContext: AuthContextEnum): ResourceDataProviderHttpClient<Resource> {
        ResourceDataProviderHttpClient.instance = new ResourceDataProviderHttpClient(
            process.env.EXPO_PUBLIC_API_BASE_URL as string,
            authContext,
        );
        return ResourceDataProviderHttpClient.instance;
    }

    /**
     * Retrieves a list of FHIR resources based on optional search parameters.
     * @param resource - The type of FHIR resource (e.g., Patient, Observation).
     * @param searchParams - Optional key-value pairs for filtering the resource list.
     * @returns A Promise resolving to the API response.
     */
    public async getList(resource: AllowedFhirTypes, searchParams?: Record<string, string>): Promise<Response> {
        if (searchParams) {
            const query = new URLSearchParams(searchParams).toString(); // Converts search params to query string.
            return this.get(`${this.baseEndpoint}/${resource}?${query}`); // Fetches resources with query params.
        }

        return this.get(`${this.baseEndpoint}/${resource}`); // Fetches resources without filtering.
    }

    /**
     * Retrieves a single FHIR resource by ID.
     * @param resource - The type of FHIR resource.
     * @param params - Object containing the ID of the resource.
     * @returns A Promise resolving to the API response.
     */
    public async getOne(resource: AllowedFhirTypes, params: { id: string }): Promise<Response> {
        return this.get(`${this.baseEndpoint}/${resource}/${params.id}`); // Fetches the specific resource by ID.
    }

    /**
     * Creates a new FHIR resource.
     * @param resource - The type of FHIR resource.
     * @param data - The data object representing the new resource.
     * @returns A Promise resolving to the API response.
     */
    public async create(resource: AllowedFhirTypes, data: T): Promise<Response> {
        return this.post(`${this.baseEndpoint}/${resource}`, data); // Sends a POST request to create the resource.
    }

}

export default ResourceDataProviderHttpClient;
