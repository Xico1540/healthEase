import GenderEnum from "./GenderEnum";

export type UserRegistration = {
    personalInfo: PersonalInfo;
    healthID: HealthID;
    contactPreferences: ContactPreferences;
    address: Address;
    password: Credentials;
};

export type PersonalInfo = {
    firstName: string;
    lastName: string;
    gender: GenderEnum;
    dateOfBirth: Date;
};

export type HealthID = {
    healthcareServiceIdentifier: number;
};

export type Address = {
    street: string;
    postalCode: string;
    city: string;
};

export type ContactPreferences = {
    email: string;
    phoneNumber: string;
};

export type Credentials = {
    password: string;
    confirmPassword: string;
};

export type UserRegistrationDto = {
    firstName: string;
    lastName: string;
    gender: number;
    birthDate: string;
    phoneNumber: string;
    email: string;
    heathID: number;
    address: {
        street: string;
        postalCode: string;
        city: string;
    };
    password: string;
};
