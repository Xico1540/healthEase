import { formatSchedule } from "../utils/dateUtils";
import ResourceDataProviderHttpClient from "../http/ResourceDataProviderHttpClient";
import { Resource, Slot } from "fhir/r4";
import { createCodeableConcept } from "../utils/fhirUtils";

/**
 * A controller class for handling transformations of appointment data.
 * This class provides methods to transform appointment data for listing, showing, creating, and editing.
 */
class AppointmentController {
    static transformList(data: any[]) {
        return data.map(this.transformShow);
    }

    static transformShow(data: any) {
        data.processedPractitioner =
            data.participant
                ?.find((p: any) => p.actor.reference.startsWith("Practitioner"))
                ?.actor.reference.split("/")[1] || "";

        data.processedPatient =
            data.participant
                ?.find((p: any) => p.actor.reference.startsWith("Patient"))
                ?.actor.reference.split("/")[1] || "";

        data.processedSpecialty =
            data.specialty?.flatMap(
                (specialty: any) =>
                    specialty.coding?.map((coding: any) => ({
                        code: coding.code,
                        display: coding.display,
                    })) || [],
            ) || [];

        data.processedSlot = data.slot?.map((slot: any) => slot.reference.split("/")[1]) || [];
        data.processedSlotSchedule = formatSchedule(data.start, data.end);

        return data;
    }

    static async transformCreateAndEdit(
        formData: any,
        resourceService: ResourceDataProviderHttpClient<Resource>,
    ): Promise<any> {
        const appointment: any = { ...formData } as any;

        appointment.participant = [];

        if (formData.processedPractitioner) {
            appointment.participant.push({
                actor: {
                    reference: `Practitioner/${formData.processedPractitioner}`,
                },
            });
        }

        if (formData.processedPatient) {
            appointment.participant.push({
                actor: {
                    reference: `Patient/${formData.processedPatient}`,
                },
            });
        }

        if (formData.processedSlot) {
            appointment.slot = [
                {
                    reference: `Slot/${formData.processedSlot}`,
                },
            ];

            const slotResource: Slot = await resourceService
                .getOne("Slot", { id: formData.processedSlot })
                .then((response) => response.json());

            appointment.start = slotResource.start;
            appointment.end = slotResource.end;
        }

        if (formData.processedSpecialty) {
            appointment.specialty = formData.processedSpecialty.map((specialty: { code: string; display: string }) =>
                createCodeableConcept(
                    "http://terminology.hl7.org/CodeSystem/v2-0203",
                    specialty.code,
                    specialty.display,
                ),
            );
        }

        appointment.processedPatient = undefined;
        appointment.processedPractitioner = undefined;
        appointment.processedSlot = undefined;
        appointment.processedSlotSchedule = undefined;
        appointment.processedSpecialty = undefined;

        return appointment;
    }
}

export default AppointmentController;
