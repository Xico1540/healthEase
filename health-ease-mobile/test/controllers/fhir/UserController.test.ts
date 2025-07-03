import { Patient, Practitioner } from "fhir/r4";
import GenderEnum from "@/src/model/GenderEnum";
import { PatientUserData } from "@/src/model/PatientUserData";
import UserController from "@/src/controllers/fhir/UserController";
import { PractitionerUserData } from "@/src/model/PractitionerUserData";

describe("UserController", () => {
    describe("transformShow", () => {
        it("should transform a Patient resource into PatientUserData", () => {
            const patient: Patient = {
                resourceType: "Patient",
                name: [{ given: ["John"], family: "Doe" }],
                birthDate: "1990-01-01",
                gender: "male",
                address: [{ line: ["123 Main St"], city: "Anytown", postalCode: "12345" }],
                telecom: [
                    { system: "phone", value: "1234567890" },
                    { system: "email", value: "john.doe@example.com" },
                ],
                photo: [{ contentType: "image/jpeg", data: "base64string" }],
                identifier: [{ system: process.env.EXPO_PUBLIC_FHIR_BASE_URL, value: "123" }],
            };

            const expected: PatientUserData = {
                personalInformation: {
                    firstName: "John",
                    lastName: "Doe",
                    dateOfBirth: new Date("1990-01-01"),
                    gender: GenderEnum.Male,
                    address: {
                        street: "123 Main St",
                        city: "Anytown",
                        postalCode: "12345",
                    },
                    photo: [
                        {
                            base64: "data:image/jpeg;base64, base64string",
                            uri: undefined,
                        },
                    ],
                    healthcareServiceIdentifier: 123,
                },
                contacts: {
                    phoneNumber: "1234567890",
                    email: "john.doe@example.com",
                },
            };

            const result = UserController.transformShow(patient);
            expect(result).toEqual(expected);
        });

        it("should transform a Practitioner resource into PractitionerUserData", () => {
            const practitioner: Practitioner = {
                resourceType: "Practitioner",
                name: [{ given: ["Jane"], family: "Doe" }],
                birthDate: "1980-05-10",
                gender: "female",
                address: [{ line: ["456 Main St"], city: "Othertown", postalCode: "54321" }],
                telecom: [
                    { system: "phone", value: "0987654321" },
                    { system: "email", value: "jane.doe@example.com" },
                ],
                extension: [
                    { url: `${process.env.EXPO_PUBLIC_FHIR_BASE_URL}/aboutMe`, valueString: "About Jane" },
                    { url: `${process.env.EXPO_PUBLIC_FHIR_BASE_URL}/education`, valueString: "Some University" },
                ],
            };

            const expected: PractitionerUserData = {
                personalInformation: {
                    firstName: "Jane",
                    lastName: "Doe",
                    dateOfBirth: new Date("1980-05-10"),
                    gender: GenderEnum.Female,
                    address: {
                        street: "456 Main St",
                        city: "Othertown",
                        postalCode: "54321",
                    },
                    photo: undefined,
                } as any,
                contacts: {
                    phoneNumber: "0987654321",
                    email: "jane.doe@example.com",
                },
                profissionalData: {
                    about: "About Jane",
                    educationInstitution: "Some University",
                },
            };

            const result = UserController.transformShow(practitioner);
            expect(result).toEqual(expected);
        });
    });

    describe("transformEdit", () => {
        it("should transform PatientUserData into an updated Patient resource", () => {
            const patient: Patient = {
                resourceType: "Patient",
                identifier: [{ system: process.env.EXPO_PUBLIC_FHIR_BASE_URL, value: "123" }],
            };

            const userProfile: PatientUserData = {
                personalInformation: {
                    firstName: "John",
                    lastName: "Doe",
                    dateOfBirth: new Date("1990-01-01"),
                    gender: GenderEnum.Male,
                    address: {
                        street: "123 Main St",
                        city: "Anytown",
                        postalCode: "12345",
                    },
                    photo: [
                        {
                            base64: "base64string",
                            uri: undefined,
                        },
                    ],
                    healthcareServiceIdentifier: 456,
                },
                contacts: {
                    phoneNumber: "1234567890",
                    email: "john.doe@example.com",
                },
            };

            const result = UserController.transformEdit(patient, userProfile) as Patient;

            expect(result.identifier?.[0].value).toBe("456");
            expect(result.name?.[0].given?.[0]).toBe("John");
            expect(result.name?.[0].family).toBe("Doe");
            expect(result.birthDate).toBe("1990-01-01");
            expect(result.gender).toBe("male");
            expect(result.address?.[0].line?.[0]).toBe("123 Main St");
            expect(result.address?.[0].city).toBe("Anytown");
            expect(result.address?.[0].postalCode).toBe("12345");
        });

        it("should transform PractitionerUserData into an updated Practitioner resource", () => {
            const practitioner: Practitioner = {
                resourceType: "Practitioner",
                extension: [],
            };

            const userProfile: PractitionerUserData = {
                personalInformation: {
                    firstName: "Jane",
                    lastName: "Doe",
                    dateOfBirth: new Date("1980-05-10"),
                    gender: GenderEnum.Female,
                    address: {
                        street: "456 Main St",
                        city: "Othertown",
                        postalCode: "54321",
                    },
                    photo: undefined,
                } as any,
                contacts: {
                    phoneNumber: "0987654321",
                    email: "jane.doe@example.com",
                },
                profissionalData: {
                    about: "Updated About Me",
                    educationInstitution: "Updated Institution",
                },
            };

            const result = UserController.transformEdit(practitioner, userProfile) as Practitioner;

            expect(result.name?.[0].given?.[0]).toBe("Jane");
            expect(result.name?.[0].family).toBe("Doe");
            expect(result.birthDate).toBe("1980-05-10");
            expect(result.gender).toBe("female");
            expect(result.address?.[0].line?.[0]).toBe("456 Main St");
            expect(result.address?.[0].city).toBe("Othertown");
            expect(result.address?.[0].postalCode).toBe("54321");

            const aboutMeExtension = result.extension?.find((ext) => ext.url.includes("aboutMe"));
            expect(aboutMeExtension?.valueString).toBe("Updated About Me");

            const educationExtension = result.extension?.find((ext) => ext.url.includes("education"));
            expect(educationExtension?.valueString).toBe("Updated Institution");
        });
    });
});
