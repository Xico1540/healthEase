import { Bundle, FhirResource } from "fhir/r4";
import ResourceDataProviderHttpClient from "@/src/http/ResourceDataProviderHttpClient";
import AllowedFhirTypes from "@/src/model/AllowedFhirTypes";
import { AuthContextEnum } from "@/src/model/Authentication";

class ResourceService {
    private static instance: ResourceService;

    private resourceDataProvider: ResourceDataProviderHttpClient<Bundle | FhirResource>;

    private constructor(authContext: AuthContextEnum) {
        this.resourceDataProvider = ResourceDataProviderHttpClient.getInstance(authContext);
    }

    public static getInstance(authContext: AuthContextEnum): ResourceService {
        ResourceService.instance = new ResourceService(authContext);
        return ResourceService.instance;
    }

    public async getList(resource: AllowedFhirTypes, searchParams?: Record<string, string>): Promise<Bundle> {
        const response = await this.resourceDataProvider.getList(resource, searchParams);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to fetch resource data with status ${response.status}: ${error}`);
        }
        return response.json();
    }

    public async getOne(resource: AllowedFhirTypes, id: string): Promise<FhirResource> {
        const response = await this.resourceDataProvider.getOne(resource, { id });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to fetch resource data with status ${response.status}: ${error}`);
        }
        return response.json();
    }

    public async create(resource: AllowedFhirTypes, data: FhirResource): Promise<FhirResource> {
        const response = await this.resourceDataProvider.create(resource, data);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to create resource with status ${response.status}: ${error}`);
        }
        return response.json();
    }
}

export default ResourceService;
