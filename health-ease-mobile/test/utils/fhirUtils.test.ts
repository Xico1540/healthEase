import { HumanName, Patient, Practitioner, PractitionerRole } from "fhir/r4";
import displayFhirHumanName, {
    extractCertifications,
    extractProfessionalHistory,
    getEducation,
    getImageUrl,
    getPatientName,
    getPractitionerName,
    getSpecialty, mapGender
} from "@/src/utils/fhirUtils";

describe("fhirUtils", () => {
    describe("displayFhirHumanName", () => {
        test("should display the human name correctly", () => {
            const name: HumanName = { given: ["John"], family: "Doe" };
            expect(displayFhirHumanName(name)).toBe("John Doe");
        });
    });

    describe("getImageUrl", () => {
        test("should return the practitioner's photo URL", () => {
            const practitioner: Practitioner = { photo: [{ url: "http://example.com/photo.jpg" }] } as any;
            expect(getImageUrl(practitioner)).toBe("http://example.com/photo.jpg");
        });

        test("should return a default URL if no photo is available", () => {
            const practitioner: Practitioner = {} as any;
            expect(getImageUrl(practitioner)).toBe("https://this-person-does-not-exist.com/img/avatar-gene620e17f25ed6164c1cfd7d877e00619.jpg");
        });
    });

    describe("getPractitionerName", () => {
        test("should return the practitioner's name", () => {
            const practitioner: Practitioner = { name: [{ given: ["John"], family: "Doe" }] } as any;
            expect(getPractitionerName(practitioner)).toBe("John Doe");
        });

        test("should return a default message if no name is specified", () => {
            const practitioner: Practitioner = {} as any;
            expect(getPractitionerName(practitioner)).toBe("Nome do Profissional não especificado");
        });
    });

    describe("getPatientName", () => {
        test("should return the patient's name", () => {
            const patient: Patient = { name: [{ given: ["Jane"], family: "Doe" }] } as any;
            expect(getPatientName(patient)).toBe("Jane Doe");
        });

        test("should return a default message if no name is specified", () => {
            const patient: Patient = {} as any;
            expect(getPatientName(patient)).toBe("Nome do Paciente não especificado");
        });
    });

    describe("getSpecialty", () => {
        test("should return the practitioner's specialty", () => {
            const practitionerRole: PractitionerRole = { specialty: [{ coding: [{ display: "Cardiology" }] }] } as any;
            expect(getSpecialty(practitionerRole)).toBe("Cardiology");
        });

        test("should return a default message if no specialty is specified", () => {
            const practitionerRole: PractitionerRole = {} as any;
            expect(getSpecialty(practitionerRole)).toBe("Sem Especialidade Especificada");
        });
    });

    describe("getEducation", () => {
        test("should return the practitioner's education", () => {
            const practitioner: Practitioner = {
                extension: [{ url: "http://example.com/fhir/StructureDefinition/education", valueString: "Harvard University" }],
            } as any;
            expect(getEducation(practitioner)).toBe("Harvard University");
        });

        test("should return a default message if no education is specified", () => {
            const practitioner: Practitioner = {} as any;
            expect(getEducation(practitioner)).toBe("Instituição de Ensino não especificada");
        });
    });

    describe("extractProfessionalHistory", () => {
        test("should return the practitioner's professional history", () => {
            const practitioner: Practitioner = {
                extension: [
                    {
                        url: "http://example.com/fhir/StructureDefinition/professionalHistory",
                        extension: [
                            {
                                url: "http://example.com/fhir/StructureDefinition/jobDetails",
                                extension: [
                                    { url: "role", valueString: "Doctor" },
                                    { url: "organization", valueString: "Hospital" },
                                    { url: "startDate", valueDate: "2020-01-01" },
                                    { url: "endDate", valueDate: "2021-01-01" },
                                    { url: "description", valueString: "Worked as a doctor" },
                                ],
                            },
                        ],
                    },
                ],
            } as any;
            expect(extractProfessionalHistory(practitioner)).toEqual([
                {
                    role: "Doctor",
                    organization: "Hospital",
                    startDate: "2020-01-01",
                    endDate: "2021-01-01",
                    description: "Worked as a doctor",
                },
            ]);
        });

        test("should return an empty array if no professional history is specified", () => {
            const practitioner: Practitioner = {} as any;
            expect(extractProfessionalHistory(practitioner)).toEqual([]);
        });
    });

    describe("extractCertifications", () => {
        test("should return the practitioner's certifications", () => {
            const practitioner: Practitioner = {
                extension: [
                    {
                        url: "http://example.com/fhir/StructureDefinition/certifications",
                        extension: [
                            {
                                url: "http://example.com/fhir/StructureDefinition/certificationDetails",
                                extension: [
                                    { url: "name", valueString: "Certification A" },
                                    { url: "issuingOrganization", valueString: "Organization A" },
                                    { url: "issueDate", valueDate: "2020-01-01" },
                                ],
                            },
                        ],
                    },
                ],
            } as any;
            expect(extractCertifications(practitioner)).toEqual([
                {
                    name: "Certification A",
                    issuingOrganization: "Organization A",
                    issueDate: "2020-01-01",
                },
            ]);
        });

        test("should return an empty array if no certifications are specified", () => {
            const practitioner: Practitioner = {} as any;
            expect(extractCertifications(practitioner)).toEqual([]);
        });
    });

    describe("mapGender", () => {
        test("should map 'male' to 'Masculino'", () => {
            expect(mapGender("male")).toBe("Masculino");
        });

        test("should map 'female' to 'Feminino'", () => {
            expect(mapGender("female")).toBe("Feminino");
        });

        test("should map undefined to 'Não especificado'", () => {
            expect(mapGender(undefined)).toBe("Não especificado");
        });
    });
});
