import { Resource, Slot } from "fhir/r4";
import AppointmentController from "../../src/controllers/AppointmentController";
import { formatSchedule } from "../../src/utils/dateUtils";
import ResourceDataProviderHttpClient from "../../src/http/ResourceDataProviderHttpClient";
import { createCodeableConcept } from "../../src/utils/fhirUtils";

jest.mock("../../src/utils/dateUtils");
jest.mock("../../src/http/ResourceDataProviderHttpClient");
jest.mock("../../src/utils/fhirUtils");



describe("AppointmentController", () => {
    describe("transformList", () => {
        it("should transform a list of data", () => {
            const data = [{ participant: [], specialty: [], slot: [] }];
            const transformedData = AppointmentController.transformList(data);
            expect(transformedData).toEqual(data.map(AppointmentController.transformShow));
        });
    });



    describe("transformShow", () => {
        it("should transform a single data item", () => {
            const data = {
                participant: [
                    { actor: { reference: "Practitioner/123" } },
                    { actor: { reference: "Patient/456" } },
                ],
                specialty: [
                    { coding: [{ code: "001", display: "Specialty 1" }] },
                ],
                slot: [{ reference: "Slot/789" }],
                start: "2023-01-01T00:00:00Z",
                end: "2023-01-01T01:00:00Z",
            };
            (formatSchedule as jest.Mock).mockReturnValue("formatted schedule");

            const transformedData = AppointmentController.transformShow(data);

            expect(transformedData.processedPractitioner).toBe("123");
            expect(transformedData.processedPatient).toBe("456");
            expect(transformedData.processedSpecialty).toEqual([{ code: "001", display: "Specialty 1" }]);
            expect(transformedData.processedSlot).toEqual(["789"]);
            expect(transformedData.processedSlotSchedule).toBe("formatted schedule");
        });
    });


    describe("transformCreateAndEdit", () => {
        it("should transform formData for create and edit", async () => {
            const formData = {
                processedPractitioner: "123",
                processedPatient: "456",
                processedSlot: "789",
                processedSpecialty: [{ code: "001", display: "Specialty 1" }],
            };
            const resourceService = new ResourceDataProviderHttpClient<Resource>("url");
            const slotResource = { start: "2023-01-01T00:00:00Z", end: "2023-01-01T01:00:00Z" } as Slot;
            (resourceService.getOne as jest.Mock).mockResolvedValue({
                json: jest.fn().mockResolvedValue(slotResource),
            });
            (createCodeableConcept as jest.Mock).mockReturnValue({
                coding: [{ code: "001", display: "Specialty 1" }],
            });

            const appointment = await AppointmentController.transformCreateAndEdit(formData, resourceService);

            expect(appointment.participant).toEqual([
                { actor: { reference: "Practitioner/123" } },
                { actor: { reference: "Patient/456" } },
            ]);
            expect(appointment.slot).toEqual([{ reference: "Slot/789" }]);
            expect(appointment.start).toBe("2023-01-01T00:00:00Z");
            expect(appointment.end).toBe("2023-01-01T01:00:00Z");
            expect(appointment.specialty).toEqual([{ coding: [{ code: "001", display: "Specialty 1" }] }]);
        });
    });
});
