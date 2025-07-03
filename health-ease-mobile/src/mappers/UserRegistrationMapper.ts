import { UserRegistration, UserRegistrationDto } from "@/src/model/UserRegistration";

const mapGender = (gender: string): number => {
    if (gender.toLowerCase() === "male") return 0;
    if (gender.toLowerCase() === "female") return 1;
    throw new Error("Invalid gender value");
};

const mapUserRegistration = (userRegistration: UserRegistration): UserRegistrationDto => ({
    firstName: userRegistration.personalInfo.firstName,
    lastName: userRegistration.personalInfo.lastName,
    gender: mapGender(userRegistration.personalInfo.gender),
    birthDate: `${new Date(userRegistration.personalInfo.dateOfBirth).toISOString().split("T")[0]}T00:00:00`,
    phoneNumber: userRegistration.contactPreferences.phoneNumber,
    email: userRegistration.contactPreferences.email,
    heathID: userRegistration.healthID.healthcareServiceIdentifier,
    address: {
        street: userRegistration.address.street,
        city: userRegistration.address.city,
        postalCode: userRegistration.address.postalCode,
    },
    password: userRegistration.password.password,
});

export default mapUserRegistration;
