import { isEmpty, isNil } from "lodash";
import { PractitionerRole } from "fhir/r4";
import { RaRecord } from "react-admin";
import { createCodeableConcept } from "../utils/fhirUtils";

/**
 * A controller class for handling transformations of location data.
 * This class provides methods to transform location data for showing, creating, and editing.
 */
class PractitionerRoleController {
    static transformList(data: any[]) {
        return data.map(this.transformShow);
    }

    static transformShow(data: any) {
        data.processedPractitioner = data.practitioner?.reference?.split("/")[1] || "";
        data.processedOrganization = data.organization?.reference?.split("/")[1] || "";
        data.processedLocation = data.location?.map((location: any) => location.reference.split("/")[1]) || [];

        data.processedSpecialty =
            data.specialty?.flatMap(
                (specialty: any) =>
                    specialty.coding?.map((coding: any) => ({
                        code: coding.code,
                        display: coding.display,
                    })) || [],
            ) || [];

        return data;
    }

    static async transformCreate(formData: RaRecord): Promise<PractitionerRole> {
        const practitionerRole: PractitionerRole = { ...formData } as PractitionerRole;

        if (!isNil(formData.practitioner)) {
            practitionerRole.practitioner = {
                reference: `Practitioner/${formData.practitioner}`,
            };
        }
        if (!isNil(formData.organization)) {
            practitionerRole.organization = {
                reference: `Organization/${formData.organization}`,
            };
        }
        if (!isNil(formData.location)) {
            practitionerRole.location = formData.location.map((location: string) => ({
                reference: `Location/${location}`,
            }));
        }
        if (!isEmpty(formData.specialty)) {
            practitionerRole.specialty = formData.specialty.map((specialty: string) =>
                createCodeableConcept("http://terminology.hl7.org/CodeSystem/v3-RoleCode", specialty, specialty),
            );
        }
        if (!isNil(formData.availableTime)) {
            practitionerRole.availableTime = formData.availableTime.map((time: any) => ({
                daysOfWeek: time.daysOfWeek,
                availableStartTime: new Date(time.availablestarttime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                availableEndTime: new Date(time.availableendtime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            }));
        }

        if (formData.processedSpecialty) {
            practitionerRole.specialty = formData.processedSpecialty.map(
                (specialty: { code: string; display: string }) =>
                    createCodeableConcept(
                        "http://terminology.hl7.org/CodeSystem/v2-0203",
                        specialty.code,
                        specialty.display,
                    ),
            );
        }

        return practitionerRole;
    }

    static async transformEdit(formData: RaRecord): Promise<any> {
        const practitionerRole: any = { ...formData } as any;
        if (!isNil(formData.processedPractitioner)) {
            practitionerRole.practitioner = {
                reference: `Practitioner/${formData.processedPractitioner}`,
            };
        }
        if (!isNil(formData.processedOrganization)) {
            practitionerRole.organization = {
                reference: `Organization/${formData.processedOrganization}`,
            };
        }
        if (!isEmpty(formData.processedLocation)) {
            practitionerRole.location = formData.processedLocation.map((location: string) => ({
                reference: `Location/${location}`,
            }));
        }
        if (!isEmpty(formData.processedSpecialty)) {
            practitionerRole.specialty = formData.processedSpecialty.map((specialty: string) =>
                createCodeableConcept("http://terminology.hl7.org/CodeSystem/v3-RoleCode", specialty, specialty),
            );
        }
        if (!isEmpty(formData.processedAvailableTime)) {
            practitionerRole.availableTime = formData.processedAvailableTime.map((time: any) => ({
                daysOfWeek: time.daysOfWeek,
                availableStartTime: new Date(time.availableStartTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                availableEndTime: new Date(time.availableEndTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            }));
        }
        if (!isEmpty(formData.processedSpecialty)) {
            practitionerRole.specialty = formData.processedSpecialty.map(
                (specialty: { code: string; display: string }) =>
                    createCodeableConcept(
                        "http://terminology.hl7.org/CodeSystem/v2-0203",
                        specialty.code,
                        specialty.display,
                    ),
            );
        }
        practitionerRole.processedPractitioner = undefined;
        practitionerRole.processedOrganization = undefined;
        practitionerRole.processedLocation = undefined;
        practitionerRole.processedSpecialty = undefined;
        practitionerRole.processedAvailableTime = undefined;
        return practitionerRole;
    }
}

export default PractitionerRoleController;
