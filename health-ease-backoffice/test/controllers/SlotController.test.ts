import { RaRecord } from "react-admin";
import SlotController from "../../src/controllers/SlotController";
import { createCodeableConcept } from "../../src/utils/fhirUtils";

jest.mock("../../src/utils/fhirUtils");

describe("SlotController", () => {
    describe("transformList", () => {
        it("should transform a list of data", () => {
            const data = [
                { serviceCategory: [{ text: "category1" }], schedule: { reference: "Schedule/1" } },
                { serviceCategory: [{ text: "category2" }], schedule: { reference: "Schedule/2" } },
            ];

            const transformedData = SlotController.transformList(data);

            expect(transformedData).toEqual([
                { serviceCategory: [{ text: "category1" }], schedule: { reference: "Schedule/1" }, processedserviceCategory: ["category1"], processedScheduleId: "1" },
                { serviceCategory: [{ text: "category2" }], schedule: { reference: "Schedule/2" }, processedserviceCategory: ["category2"], processedScheduleId: "2" },
            ]);
        });
    });

    describe("transformShow", () => {
        it("should transform a single data item", () => {
            const data = { serviceCategory: [{ text: "category1" }], schedule: { reference: "Schedule/1" } };

            const transformedData = SlotController.transformShow(data);

            expect(transformedData).toEqual({ serviceCategory: [{ text: "category1" }], schedule: { reference: "Schedule/1" }, processedserviceCategory: ["category1"], processedScheduleId: "1" });
        });
    });

    describe("transformCreate", () => {
        it("should transform formData for create", async () => {
            const formData = {
                id: "1",
                serviceCategory: ["category1"],
                schedule: "1",
            } as RaRecord;

            (createCodeableConcept as jest.Mock).mockImplementation((system, code, display) => ({
                coding: [{ system, code, display }],
            }));

            const slot = await SlotController.transformCreate(formData);

            expect(slot.serviceCategory).toEqual([
                { coding: [{ system: "http://terminology.hl7.org/CodeSystem/service-category", code: "category1", display: "category1" }] },
            ]);
            expect(slot.schedule).toEqual({ reference: "Schedule/1" });
        });
    });

    describe("transformEdit", () => {
        it("should transform formData for edit", async () => {
            const formData = {
                id: "1",
                processedserviceCategory: ["category1"],
                processedScheduleId: "1",
            } as RaRecord;

            (createCodeableConcept as jest.Mock).mockImplementation((system, code, display) => ({
                coding: [{ system, code, display }],
            }));

            const slot = await SlotController.transformEdit(formData);

            expect(slot.serviceCategory).toEqual([
                { coding: [{ system: "http://terminology.hl7.org/CodeSystem/service-category", code: "category1", display: "category1" }] },
            ]);
            expect(slot.schedule).toEqual({ reference: "Schedule/1" });
            expect(slot.processedserviceCategory).toBeUndefined();
            expect(slot.processedScheduleId).toBeUndefined();
        });
    });
});
