import { RaRecord } from "react-admin";
import OrganizationController from "../../src/controllers/OrganizationController";
import { createCodeableConcept } from "../../src/utils/fhirUtils";

jest.mock("../../src/utils/fhirUtils");

describe("OrganizationController", () => {
    describe("transformShow", () => {
        it("should transform a single data item", () => {
            const data = {
                type: [{ text: "Type 1" }],
            };

            const transformedData = OrganizationController.transformShow(data);

            expect(transformedData.processedType).toEqual(["Type 1"]);
        });
    });

    describe("transformCreate", () => {
        it("should transform formData for create", async () => {
            const formData = {
                id: "1",
                type: ["Type 1"],
            } as RaRecord;

            (createCodeableConcept as jest.Mock).mockImplementation((system, code, display) => ({
                coding: [{ system, code, display }],
            }));

            const organization = await OrganizationController.transformCreate(formData);

            expect(organization.type).toEqual([
                { coding: [{ system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode", code: "Type 1", display: "Type 1" }] },
            ]);
        });
    });

    describe("transformEdit", () => {
        it("should transform formData for edit", async () => {
            const formData = {
                id: "1",
                processedType: ["Type 1"],
            } as RaRecord;

            (createCodeableConcept as jest.Mock).mockImplementation((system, code, display) => ({
                coding: [{ system, code, display }],
            }));

            const organization = await OrganizationController.transformEdit(formData);

            expect(organization.type).toEqual([
                { coding: [{ system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode", code: "Type 1", display: "Type 1" }] },
            ]);
            expect(organization.processedType).toBeUndefined();
        });
    });
});
