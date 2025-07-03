import GenderEnum from "@/src/model/GenderEnum";

export type PatientUserData = {
    personalInformation: UserPersonalInformation;
    contacts: UserContacts;
};

export type UserPersonalInformation = {
    firstName: string;
    lastName: string;
    photo?: ImageDetails[];
    dateOfBirth: Date;
    gender: GenderEnum;
    healthcareServiceIdentifier: number;
    address: UserAddress;
};

export type UserContacts = {
    phoneNumber: string;
    email: string;
};

export type UserAddress = {
    street?: string;
    city?: string;
    postalCode?: string;
};

export type ImageDetails = {
    uri?: string;
    base64?: string | null;
    fileName?: string | null;
    mimeType?: string | null;
};
