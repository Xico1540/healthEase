import { RaRecord } from "react-admin";
import LocationController from "../../src/controllers/LocationController";
import { createCodeableConcept } from "../../src/utils/fhirUtils";

jest.mock("../../src/utils/fhirUtils");

describe("LocationController", () => {
    describe("transformShow", () => {
        it("should transform a single data item", () => {
            const data = {
                type: [{ text: "Type 1" }],
                physicalType: { text: "Physical Type 1" },
                managingOrganization: { reference: "Organization/123" },
            };

            const transformedData = LocationController.transformShow(data);

            expect(transformedData.processedType).toEqual(["Type 1"]);
            expect(transformedData.processedPhysicalType).toBe("Physical Type 1");
            expect(transformedData.processedOrganizationId).toBe("123");
        });
    });

    describe("transformCreate", () => {
        it("should transform formData for create", async () => {
            const formData = {
                id: "1",
                managingOrganization: "123",
                type: ["Type 1"],
                physicalType: "Physical Type 1",
            } as RaRecord;

            (createCodeableConcept as jest.Mock).mockImplementation((system, code, display) => ({
                coding: [{ system, code, display }],
            }));

            const location = await LocationController.transformCreate(formData);

            expect(location.managingOrganization).toEqual({ reference: "Organization/123" });
            expect(location.type).toEqual([
                {
                    coding: [
                        {
                            system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
                            code: "Type 1",
                            display: "Type 1",
                        },
                    ],
                },
            ]);
            expect(location.physicalType).toEqual({
                coding: [
                    {
                        system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
                        code: "Physical Type 1",
                        display: "Physical Type 1",
                    },
                ],
            });
        });
    });

    describe("transformEdit", () => {
        it("should transform formData for edit", async () => {
            const formData = {
                id: "1",
                processedOrganizationId: "123",
                processedType: ["Type 1"],
                processedPhysicalType: "Physical Type 1",
            } as RaRecord;

            (createCodeableConcept as jest.Mock).mockImplementation((system, code, display) => ({
                coding: [{ system, code, display }],
            }));

            const location = await LocationController.transformEdit(formData);

            expect(location.managingOrganization).toEqual({ reference: "Organization/123" });
            expect(location.type).toEqual([
                {
                    coding: [
                        {
                            system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
                            code: "Type 1",
                            display: "Type 1",
                        },
                    ],
                },
            ]);
            expect(location.physicalType).toEqual({
                coding: [
                    {
                        system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
                        code: "Physical Type 1",
                        display: "Physical Type 1",
                    },
                ],
            });
            expect(location.processedType).toBeUndefined();
            expect(location.processedPhysicalType).toBeUndefined();
            expect(location.processedOrganizationId).toBeUndefined();
        });
    });
});
