import { RaRecord } from "react-admin";
import { Slot } from "fhir/r4";
import { createCodeableConcept } from "../utils/fhirUtils";
import { isEmpty } from "lodash";

/**
 * A controller class for handling transformations of location data.
 * This class provides methods to transform location data for showing, creating, and editing.
 */
class SlotController {
    static transformList(data: any[]) {
        return data.map(this.transformShow);
    }

    static transformShow(data: any) {
        data.processedserviceCategory = data.serviceCategory?.map((serviceCategory: any) => serviceCategory.text) || [];
        data.processedScheduleId = data.schedule?.reference?.split("/")[1] || "";
        return data;
    }

    static async transformCreate(formData: RaRecord): Promise<Slot> {
        const slot: Slot = { ...formData } as Slot;
        if (formData.serviceCategory) {
            slot.serviceCategory = formData.serviceCategory.map((serviceCategory: string) =>
                createCodeableConcept(
                    "http://terminology.hl7.org/CodeSystem/service-category",
                    serviceCategory,
                    serviceCategory,
                ),
            );
        }

        if (!isEmpty(formData.schedule)) {
            slot.schedule = {
                reference: `Schedule/${formData.schedule}`,
            };
        }

        return slot;
    }

    static async transformEdit(formData: RaRecord): Promise<any> {
        const slot: any = { ...formData } as any;
        if (!isEmpty(formData.processedserviceCategory)) {
            slot.serviceCategory = formData.processedserviceCategory.map((serviceCategory: string) =>
                createCodeableConcept(
                    "http://terminology.hl7.org/CodeSystem/service-category",
                    serviceCategory,
                    serviceCategory,
                ),
            );
        }

        if (!isEmpty(formData.processedScheduleId)) {
            slot.schedule = {
                reference: `Schedule/${formData.processedScheduleId}`,
            };
        }

        slot.processedserviceCategory = undefined;
        slot.processedScheduleId = undefined;
        return slot;
    }
}

export default SlotController;
