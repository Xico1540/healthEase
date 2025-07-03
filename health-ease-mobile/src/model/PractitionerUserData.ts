import { PatientUserData } from "@/src/model/PatientUserData";

export interface PractitionerUserData extends PatientUserData {
    profissionalData: ProfissionalData;
}

export interface ProfissionalData {
    educationInstitution: string;
    about: string;
}
