import { RaRecord } from "react-admin";
import { createCodeableConcept } from "../../src/utils/fhirUtils";
import ScheduleController from "../../src/controllers/ScheduleController";

jest.mock("../../src/utils/fhirUtils");

describe("ScheduleController", () => {
    describe("transformCreate", () => {
        it("should transform formData for create", async () => {
            const formData = {
                id: "1",
                actor: "123",
                serviceType: ["serviceType1"],
                serviceCategory: ["serviceCategory1"],
                specialty: ["specialty1"],
                availableTime: [
                    {
                        daysOfWeek: ["monday"],
                        availablestarttime: "2024-11-29T09:00:00Z",
                        availableendtime: "2024-11-29T17:00:00Z",
                    },
                ],
            } as RaRecord;

            (createCodeableConcept as jest.Mock).mockImplementation((system, code, display) => ({
                coding: [{ system, code, display }],
            }));

            const schedule = await ScheduleController.transformCreate(formData);

            expect(schedule.actor).toEqual([{ reference: "Practitioner/123" }]);
            expect(schedule.planningHorizon).toEqual(undefined);
        });
    });

    describe("transformEdit", () => {
        it("should transform formData for edit", async () => {
            const formData = {
                id: "1",
                processedServiceCategory: ["serviceCategory1"],
                processedServiceType: ["serviceType1"],
                processedSpecialty: ["specialty1"],
                actor: "123",
            } as RaRecord;

            (createCodeableConcept as jest.Mock).mockImplementation((system, code, display) => ({
                coding: [{ system, code, display }],
            }));

            const schedule = await ScheduleController.transformEdit(formData);

            expect(schedule.serviceCategory).toEqual([
                {
                    coding: [
                        {
                            system: "http://terminology.hl7.org/CodeSystem/service-category",
                            code: "serviceCategory1",
                            display: "serviceCategory1",
                        },
                    ],
                },
            ]);
            expect(schedule.serviceType).toEqual([
                {
                    coding: [
                        {
                            system: "http://terminology.hl7.org/CodeSystem/service-category",
                            code: "serviceType1",
                            display: "serviceType1",
                        },
                    ],
                },
            ]);
            expect(schedule.specialty).toEqual([
                {
                    coding: [
                        {
                            system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
                            code: "specialty1",
                            display: "specialty1",
                        },
                    ],
                },
            ]);
            expect(schedule.actor).toEqual([{ reference: "Practitioner/123" }]);
            expect(schedule.processedSpecialty).toBeUndefined();
            expect(schedule.processedServiceCategory).toBeUndefined();
            expect(schedule.processedServiceType).toBeUndefined();
            expect(schedule.processedPractitioner).toBeUndefined();
        });
    });
});
