import { PatientUserData } from "@/src/model/PatientUserData";
import GenderEnum from "@/src/model/GenderEnum";
import { UserRegistration } from "@/src/model/UserRegistration";

export const PatientUserEqualDataObj1: PatientUserData = {
    personalInformation: {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: new Date("1990-01-01"),
        gender: GenderEnum.Male,
        healthcareServiceIdentifier: 123,
        address: {
            street: "123 Main St",
            city: "Anytown",
            postalCode: "12345",
        },
        photo: [],
    },
    contacts: {
        phoneNumber: "1234567890",
        email: "john.doe@example.com",
    },
};

export const PatientUserEqualDataObj2: PatientUserData = {
    personalInformation: {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: new Date("1990-01-01"),
        gender: GenderEnum.Male,
        healthcareServiceIdentifier: 123,
        address: {
            street: "123 Main St",
            city: "Anytown",
            postalCode: "12345",
        },
        photo: [],
    },
    contacts: {
        phoneNumber: "1234567890",
        email: "john.doe@example.com",
    },
};

export const PatientUserDiffDataObj1: PatientUserData = {
    personalInformation: {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: new Date("1990-01-01"),
        gender: GenderEnum.Male,
        healthcareServiceIdentifier: 123,
        address: {
            street: "123 Main St",
            city: "Anytown",
            postalCode: "12345",
        },
        photo: [],
    },
    contacts: {
        phoneNumber: "1234567890",
        email: "john.doe@example.com",
    },
};

export const PatientUserDiffDataObj2: PatientUserData = {
    personalInformation: {
        firstName: "Jane",
        lastName: "Doe",
        dateOfBirth: new Date("1990-01-01"),
        gender: GenderEnum.Female,
        healthcareServiceIdentifier: 123,
        address: {
            street: "123 Main St",
            city: "Anytown",
            postalCode: "12345",
        },
        photo: [],
    },
    contacts: {
        phoneNumber: "1234567890",
        email: "jane.doe@example.com",
    },
};

export const userRegistrationObj1: UserRegistration = {
    personalInfo: {
        firstName: "John",
        lastName: "Doe",
        gender: GenderEnum.Male,
        dateOfBirth: new Date("1990-01-01"),
    },
    healthID: {
        healthcareServiceIdentifier: 123,
    },
    contactPreferences: {
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
    },
    address: {
        street: "123 Main St",
        postalCode: "12345",
        city: "Anytown",
    },
    password: {
        password: "securePassword123",
        confirmPassword: "securePassword123",
    },
};

export const userRegistrationObj2: UserRegistration = {
    personalInfo: {
        firstName: "Jane",
        lastName: "Doe",
        gender: GenderEnum.Female,
        dateOfBirth: new Date("1990-01-01"),
    },
    healthID: {
        healthcareServiceIdentifier: 123,
    },
    contactPreferences: {
        email: "jane.doe@example.com",
        phoneNumber: "0987654321",
    },
    address: {
        street: "456 Main St",
        postalCode: "54321",
        city: "Othertown",
    },
    password: {
        password: "securePassword456",
        confirmPassword: "securePassword456",
    },
};

export const userRegistrationObj3: UserRegistration = {
    personalInfo: {
        firstName: "Alex",
        lastName: "Smith",
        gender: "unknown" as GenderEnum,
        dateOfBirth: new Date("1990-01-01"),
    },
    healthID: {
        healthcareServiceIdentifier: 123,
    },
    contactPreferences: {
        email: "alex.smith@example.com",
        phoneNumber: "1122334455",
    },
    address: {
        street: "789 Main St",
        postalCode: "67890",
        city: "New City",
    },
    password: {
        password: "securePassword789",
        confirmPassword: "securePassword789",
    },
};
