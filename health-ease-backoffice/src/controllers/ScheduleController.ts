import { Schedule } from "fhir/r4";
import { RaRecord } from "react-admin";
import { isEmpty } from "lodash";
import { createCodeableConcept } from "../utils/fhirUtils";

/**
 * A controller class for handling transformations of location data.
 * This class provides methods to transform location data for showing, creating, and editing.
 */
class ScheduleController {
    static async transformCreate(formData: RaRecord): Promise<Schedule> {
        const schedule: Schedule = { ...formData } as Schedule;

        if (!isEmpty(formData.actor) && !Array.isArray(formData.actor)) {
            schedule.actor = Array.isArray(formData.actor)
                ? formData.actor.map((actor: string) => ({ reference: `Practitioner/${actor}` }))
                : [{ reference: `Practitioner/${formData.actor}` }];
        }

        if (!isEmpty(formData.serviceType) && !Array.isArray(formData.serviceType)) {
            schedule.serviceType = formData.serviceType.map((serviceType: string) =>
                createCodeableConcept(
                    "http://terminology.hl7.org/CodeSystem/service-category",
                    serviceType,
                    serviceType,
                ),
            );
        }

        if (!isEmpty(formData.serviceCategory) && !Array.isArray(formData.serviceCategory)) {
            schedule.serviceCategory = formData.serviceCategory.map((category: string) =>
                createCodeableConcept("http://terminology.hl7.org/CodeSystem/service-category", category, category),
            );
        }

        if (!isEmpty(formData.specialty) && !Array.isArray(formData.specialty)) {
            schedule.specialty = formData.specialty.map((specialty: string) =>
                createCodeableConcept("http://terminology.hl7.org/CodeSystem/v3-RoleCode", specialty, specialty),
            );
        }
        if (!isEmpty(formData.availableTime) && !Array.isArray(formData.availableTime)) {
            schedule.planningHorizon = formData.availableTime.map((time: any) => ({
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
        return schedule;
    }

    static async transformEdit(formData: RaRecord): Promise<any> {
        const schedule: any = { ...formData } as any;

        if (!isEmpty(formData.processedServiceCategory)) {
            schedule.serviceCategory = formData.processedServiceCategory.map((category: string) =>
                createCodeableConcept("http://terminology.hl7.org/CodeSystem/service-category", category, category),
            );
        }

        if (!isEmpty(formData.processedServiceType)) {
            schedule.serviceType = formData.processedServiceType.map((serviceType: string) =>
                createCodeableConcept(
                    "http://terminology.hl7.org/CodeSystem/service-category",
                    serviceType,
                    serviceType,
                ),
            );
        }

        if (!isEmpty(formData.processedSpecialty)) {
            schedule.specialty = formData.processedSpecialty.map((specialty: string) =>
                createCodeableConcept("http://terminology.hl7.org/CodeSystem/v3-RoleCode", specialty, specialty),
            );
        }

        if (!isEmpty(formData.actor) && !Array.isArray(formData.actor)) {
            schedule.actor = Array.isArray(formData.actor)
                ? formData.actor.map((actor: string) => ({ reference: `Practitioner/${actor}` }))
                : [{ reference: `Practitioner/${formData.actor}` }];
        }

        delete schedule.processedSpecialty;
        delete schedule.processedServiceCategory;
        delete schedule.processedServiceType;
        delete schedule.processedPractitioner;

        return schedule;
    }
}

export default ScheduleController;
