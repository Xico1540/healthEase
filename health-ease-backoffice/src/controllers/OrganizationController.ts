import { Organization } from "fhir/r2";
import { RaRecord } from "react-admin";
import { isEmpty } from "lodash";
import { createCodeableConcept } from "../utils/fhirUtils";

/**
 * A controller class for handling transformations of location data.
 * This class provides methods to transform location data for showing, creating, and editing.
 */
class OrganizationController {
    static transformShow(data: any) {
        data.processedType = data.type?.map((type: any) => type.text) || [];
        return data;
    }

    static async transformCreate(formData: RaRecord): Promise<Organization> {
        const organization: Organization = { ...formData } as Organization;
        if (!isEmpty(formData.type)) {
            organization.type = formData.type.map((type: string) =>
                createCodeableConcept("http://terminology.hl7.org/CodeSystem/v3-RoleCode", type, type),
            );
        }
        return organization;
    }

    static async transformEdit(formData: RaRecord): Promise<any> {
        const organization: any = { ...formData } as any;
        if (!isEmpty(formData.processedType)) {
            organization.type = formData.processedType.map((type: string) =>
                createCodeableConcept("http://terminology.hl7.org/CodeSystem/v3-RoleCode", type, type),
            );
        }
        organization.processedType = undefined;
        return organization;
    }
}

export default OrganizationController;
