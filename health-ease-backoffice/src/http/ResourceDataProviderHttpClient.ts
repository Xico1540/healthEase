import * as fhir from "fhir/r4";
import AbstractHttpAuthClient from "./AbstractAuthHttpClient";
import { Identifier } from "ra-core";

/**
 * A concrete HTTP client class for interacting with FHIR resources.
 * This class provides methods to perform CRUD operations on FHIR resources,
 * such as getting a list of resources, getting a single resource by ID, creating,
 * updating, and deleting resources. It uses authentication headers for secure communication.
 * The class follows the Singleton pattern to ensure only one instance is created.
 */
class ResourceDataProviderHttpClient<T> extends AbstractHttpAuthClient<T> {
    private static instance: ResourceDataProviderHttpClient<fhir.Resource>;

    private baseEndpoint: string = "fhir";

    public static getInstance(): ResourceDataProviderHttpClient<fhir.Resource> {
        if (!ResourceDataProviderHttpClient.instance) {
            ResourceDataProviderHttpClient.instance = new ResourceDataProviderHttpClient(
                process.env.REACT_APP_API_BASE_URL as string,
            );
        }
        return ResourceDataProviderHttpClient.instance;
    }

    public async getList(resource: string): Promise<Response> {
        return this.get(`${this.baseEndpoint}/${resource}`);
    }

    public async getListWithFilters(resource: string, filter: string): Promise<Response> {
        return this.get(`${this.baseEndpoint}/${resource}?${filter}`);
    }

    public async getOne(resource: string, params: { id: string }): Promise<Response> {
        return this.get(`${this.baseEndpoint}/${resource}/${params.id}`);
    }

    public async create(resource: string, data: T): Promise<Response> {
        return this.post(`${this.baseEndpoint}/${resource}`, data);
    }

    public async update(resource: string, params: { id: Identifier; data: T }): Promise<Response> {
        return this.put(`${this.baseEndpoint}/${resource}/${params.id}`, params.data);
    }

    public async remove(resource: string, id: Identifier): Promise<Response> {
        return this.delete(`${this.baseEndpoint}/${resource}/${id}`);
    }
}

export default ResourceDataProviderHttpClient;
