import { RaRecord } from "react-admin";
import { PatientController } from "../../src/controllers/PatientController";

describe("PatientController", () => {
    describe("transformCreate", () => {
        test("should transform formData for create", async () => {
            const formData = {
                id: "1",
                snsIdentifier: "123456789",
            } as RaRecord;

            const patient = await PatientController.transformCreate(formData);

            expect(patient.identifier).toEqual([
                {
                    system: "heathId",
                    value: "123456789",
                },
            ]);
            expect(patient.snsIdentifier).toBeUndefined();
        });

        test("should not add identifier if snsIdentifier is nil", async () => {
            const formData = {
                id: "1",
                snsIdentifier: null,
            } as RaRecord;

            const patient = await PatientController.transformCreate(formData);

            expect(patient.identifier).toBeUndefined();
            expect(patient.snsIdentifier).toBeUndefined();
        });
    });
});
