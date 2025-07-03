import { RaRecord } from "react-admin";
import { Location } from "fhir/r4";
import { isEmpty, isNil } from "lodash";
import { createCodeableConcept } from "../utils/fhirUtils";

/**
 * A controller class for handling transformations of location data.
 * This class provides methods to transform location data for showing, creating, and editing.
 */
class LocationController {
    static transformShow(data: any) {
        data.processedType = data.type?.map((type: any) => type.text) || [];
        data.processedPhysicalType = data.physicalType?.text || "";
        data.processedOrganizationId = data.managingOrganization?.reference?.split("/")[1] || "";
        return data;
    }

    static async transformCreate(formData: RaRecord): Promise<Location> {
        const location: Location = { ...formData } as Location;

        if (!isNil(formData.managingOrganization)) {
            location.managingOrganization = {
                reference: `Organization/${formData.managingOrganization}`,
            };
        }
        if (!isEmpty(formData.type)) {
            location.type = formData.type.map((type: string) =>
                createCodeableConcept("http://terminology.hl7.org/CodeSystem/v3-RoleCode", type, type),
            );
        }
        if (!isEmpty(formData.physicalType)) {
            location.physicalType = createCodeableConcept(
                "http://terminology.hl7.org/CodeSystem/location-physical-type",
                formData.physicalType,
                formData.physicalType,
            );
        }
        return location;
    }

    static async transformEdit(formData: RaRecord): Promise<any> {
        const location: any = { ...formData } as any;

        if (!isNil(formData.processedOrganizationId)) {
            location.managingOrganization = {
                reference: `Organization/${formData.processedOrganizationId}`,
            };
        }
        if (!isEmpty(formData.processedType)) {
            location.type = formData.processedType.map((type: string) =>
                createCodeableConcept("http://terminology.hl7.org/CodeSystem/v3-RoleCode", type, type),
            );
        }
        if (!isEmpty(formData.processedPhysicalType)) {
            location.physicalType = createCodeableConcept(
                "http://terminology.hl7.org/CodeSystem/location-physical-type",
                formData.processedPhysicalType,
                formData.processedPhysicalType,
            );
        }

        location.processedType = undefined;
        location.processedPhysicalType = undefined;
        location.processedOrganizationId = undefined;

        return location;
    }
}
export default LocationController;
