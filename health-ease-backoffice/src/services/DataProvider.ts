import ResourceDataProviderHttpClient from "../http/ResourceDataProviderHttpClient";
import { Bundle, BundleEntry, Resource, Location, Organization, PractitionerRole, Slot, Appointment } from "fhir/r4";
import {
    CreateParams,
    CreateResult,
    DataProvider,
    DeleteManyParams,
    DeleteManyResult,
    DeleteParams,
    DeleteResult,
    FilterPayload,
    GetListParams,
    GetListResult,
    GetManyParams,
    GetManyReferenceParams,
    GetManyReferenceResult,
    GetManyResult,
    GetOneParams,
    GetOneResult,
    QueryFunctionContext,
    RaRecord,
    UpdateManyParams,
    UpdateManyResult,
    UpdateParams,
    UpdateResult,
} from "react-admin";
import { DataError, DataErrorTypes } from "../errors/DataErrors";
import { isEmpty, isNil } from "lodash";
import LocationController from "../controllers/LocationController";
import OrganizationController from "../controllers/OrganizationController";
import PractitionerRoleController from "../controllers/PractitionerRoleController";
import SlotController from "../controllers/SlotController";
import AppointmentController from "../controllers/AppointmentController";

/**
 * A concrete data provider class for interacting with FHIR resources.
 * This class implements the DataProvider interface from react-admin and provides
 * methods to perform CRUD operations on FHIR resources. It uses the ResourceDataProviderHttpClient
 * to make HTTP requests to the FHIR API.
 */
class FhirDataProvider implements DataProvider {
    private async getListAux(resourceType: string, filters?: FilterPayload): Promise<Response> {
        const resourceDataProviderHttpClient = ResourceDataProviderHttpClient.getInstance();
        if (!isNil(filters) || !isEmpty(filters)) {
            const filter = new URLSearchParams(filters).toString();
            return resourceDataProviderHttpClient.getListWithFilters(resourceType, filter);
        } else {
            return resourceDataProviderHttpClient.getList(resourceType);
        }
    }

    async getList<RecordType extends RaRecord = RaRecord>(
        resourceType: string,
        params: GetListParams,
    ): Promise<GetListResult<RecordType>> {
        const response = await this.getListAux(resourceType, params.filter);
        const data: Bundle = await response.json();
        const transformedResource = await this.transformList(
            resourceType,
            data?.entry?.map((entry: BundleEntry) => entry.resource) as Resource[],
        );
        return {
            data: (transformedResource as unknown as RecordType[]) || [],
            total: data?.entry?.length || 0,
        };
    }

    async getOne<RecordType extends RaRecord = RaRecord>(
        resourceType: string,
        params: GetOneParams,
    ): Promise<GetOneResult<RecordType>> {
        const response = await ResourceDataProviderHttpClient.getInstance().getOne(resourceType, params);
        const transformedResource = await this.transformResource(resourceType, await response.json());
        return {
            data: transformedResource as unknown as RecordType,
        };
    }

    async create<RecordType extends RaRecord = RaRecord>(
        resourceType: string,
        params: CreateParams<RecordType>,
    ): Promise<CreateResult<RecordType>> {
        const resourceObject: Resource = {
            resourceType: resourceType,
            id: typeof params.data.id === "string" ? params.data.id : undefined,
            ...params.data,
        };
        const response = await ResourceDataProviderHttpClient.getInstance().create(resourceType, resourceObject);
        return {
            data: (await response.json()) as RecordType,
        };
    }

    async update<RecordType extends RaRecord = RaRecord>(
        resourceType: string,
        params: UpdateParams<RecordType>,
    ): Promise<UpdateResult<RecordType>> {
        const resourceObject: Resource = {
            resourceType: resourceType,
            ...params.previousData,
            ...params.data,
            id: typeof params.data.id === "string" ? params.data.id : undefined,
        };

        const response = await ResourceDataProviderHttpClient.getInstance().update(resourceType, {
            id: params.id,
            data: resourceObject,
        });

        if (!response.ok) {
            return Promise.reject(new Error(await response.text()));
        }

        return {
            data: (await response.json()) as RecordType,
        };
    }

    async delete<RecordType extends RaRecord = RaRecord>(
        resourceType: string,
        params: DeleteParams<RecordType>,
    ): Promise<DeleteResult<RecordType>> {
        await ResourceDataProviderHttpClient.getInstance().remove(resourceType, params.id);
        return {
            data: params.previousData as RecordType,
        };
    }

    async deleteMany<RecordType extends RaRecord = RaRecord>(
        resourceType: string,
        params: DeleteManyParams<RecordType>,
    ): Promise<DeleteManyResult<RecordType>> {
        for (const id of params.ids) {
            const response = await ResourceDataProviderHttpClient.getInstance().remove(resourceType, id);
            if (!response.ok) {
                if (response.status === 400) {
                    return Promise.reject(
                        new DataError(
                            DataErrorTypes.DELETE_RESOURCE_REFERENCE_ERROR,
                            "Não é possível eliminar a resource selecionada pois está associada a um ou mais recursos",
                        ),
                    );
                }
            }
        }
        return {
            data: params.ids,
        };
    }

    async getMany<RecordType extends RaRecord = RaRecord>(
        resourceType: string,
        params: GetManyParams<RecordType> & QueryFunctionContext,
    ): Promise<GetManyResult<RecordType>> {
        const response = await ResourceDataProviderHttpClient.getInstance().getList(resourceType);
        const data: Bundle = await response.json();
        return {
            data: (data?.entry?.map((entry: BundleEntry) => entry.resource) as unknown as RecordType[]) || [],
        };
    }

    async getManyReference<RecordType extends RaRecord = RaRecord>(
        resourceType: string,
        params: GetManyReferenceParams & QueryFunctionContext,
    ): Promise<GetManyReferenceResult<RecordType>> {
        return Promise.resolve({ data: [], total: 0 });
    }

    async updateMany<RecordType extends RaRecord = RaRecord>(
        resourceType: string,
        params: UpdateManyParams,
    ): Promise<UpdateManyResult<RecordType>> {
        return Promise.resolve({ data: params.ids });
    }

    async transformList(resourceType: string, resources: Resource[]) {
        if (!isEmpty(resources)) {
            switch (resourceType) {
                case "PractitionerRole":
                    return PractitionerRoleController.transformList(resources as PractitionerRole[]);
                case "Appointment":
                    return AppointmentController.transformList(resources as Appointment[]);
                case "Slot":
                    return SlotController.transformList(resources.slice(0, 20) as Slot[]);
                default:
                    return resources;
            }
        }
    }

    async transformResource(resourceType: string, resource: Resource) {
        if (!isNil(resource)) {
            switch (resourceType) {
                case "Location":
                    return LocationController.transformShow(resource as Location);
                case "Organization":
                    return OrganizationController.transformShow(resource as Organization);
                case "PractitionerRole":
                    return PractitionerRoleController.transformShow(resource as PractitionerRole);
                case "Slot":
                    return SlotController.transformShow(resource as Slot);
                case "Appointment":
                    return AppointmentController.transformShow(resource as Appointment);
                default:
                    return resource;
            }
        }
    }
}

export default FhirDataProvider;
