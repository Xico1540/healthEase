import { HumanName, Patient, Practitioner, PractitionerRole } from "fhir/r4";
import { Job } from "@/src/model/Job";
import { Certification } from "@/src/model/Certification";

const displayFhirHumanName = (name: HumanName): string => `${name.given?.[0] || ""} ${name.family || ""}`;

export const getImageUrl = (practitioner: Practitioner): string => {
    if (practitioner.photo?.[0]?.data) {
        return `data:image/jpeg;base64,${practitioner.photo[0].data}`;
    }
    return practitioner.photo?.[0]?.url ||
        "https://bucketlds.s3.us-east-1.amazonaws.com/avatar.webp";
};

export const getPractitionerName = (practitioner: Practitioner): string =>
    practitioner.name ? displayFhirHumanName(practitioner.name[0]) : "Nome do Profissional não especificado";

export const getPatientName = (patient: Patient): string =>
    patient.name ? displayFhirHumanName(patient.name[0]) : "Nome do Paciente não especificado";

export const getSpecialty = (practitionerRole: PractitionerRole): string =>
    practitionerRole.specialty?.[0]?.coding?.[0]?.display || "Sem Especialidade Especificada";

export const getEducation = (practitioner: Practitioner): string => {
    const educationExtension = practitioner.extension?.find(
        (ext) => ext.url === "http://example.com/fhir/StructureDefinition/education",
    );
    return educationExtension?.valueString || "Instituição de Ensino não especificada";
};

export const extractProfessionalHistory = (practitioner: Practitioner): Job[] => {
    const professionalHistoryExtension = practitioner.extension?.find(
        (ext) => ext.url === "http://example.com/fhir/StructureDefinition/professionalHistory",
    );
    return professionalHistoryExtension
        ? (professionalHistoryExtension.extension?.map((job) => ({
              role: job.extension?.find((e) => e.url === "role")?.valueString || "",
              organization: job.extension?.find((e) => e.url === "organization")?.valueString || "",
              startDate: job.extension?.find((e) => e.url === "startDate")?.valueDate || "",
              endDate: job.extension?.find((e) => e.url === "endDate")?.valueDate || "",
              description: job.extension?.find((e) => e.url === "description")?.valueString || "",
          })) ?? [])
        : [];
};

export const extractCertifications = (practitioner: Practitioner): Certification[] => {
    const certificationsExtension = practitioner.extension?.find(
        (ext) => ext.url === "http://example.com/fhir/StructureDefinition/certifications",
    );
    return certificationsExtension
        ? (certificationsExtension.extension?.map((cert) => ({
              name: cert.extension?.find((e) => e.url === "name")?.valueString,
              issuingOrganization: cert.extension?.find((e) => e.url === "issuingOrganization")?.valueString,
              issueDate: cert.extension?.find((e) => e.url === "issueDate")?.valueDate,
          })) ?? [])
        : [];
};

export const mapGender = (gender: string | undefined): string => {
    switch (gender) {
        case "male":
            return "Masculino";
        case "female":
            return "Feminino";
        default:
            return "Não especificado";
    }
};

export default displayFhirHumanName;
