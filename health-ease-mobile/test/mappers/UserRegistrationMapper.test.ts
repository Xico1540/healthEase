import mapUserRegistration from "@/src/mappers/UserRegistrationMapper";
import { userRegistrationObj1, userRegistrationObj2, userRegistrationObj3 } from "@/test/testDataUtils";

describe("mapUserRegistration", () => {
    test("should map a UserRegistration object to a UserRegistrationDto object correctly for male gender", () => {
        const expectedDto = {
            firstName: "John",
            lastName: "Doe",
            gender: 0,
            birthDate: "1990-01-01T00:00:00",
            phoneNumber: "1234567890",
            email: "john.doe@example.com",
            heathID: 123,
            address: {
                street: "123 Main St",
                postalCode: "12345",
                city: "Anytown",
            },
            password: "securePassword123",
        };
        expect(mapUserRegistration(userRegistrationObj1)).toEqual(expectedDto);
    });

    test("should map a UserRegistration object to a UserRegistrationDto object correctly for female gender", () => {
        const expectedDto = {
            firstName: "Jane",
            lastName: "Doe",
            gender: 1,
            birthDate: "1990-01-01T00:00:00",
            phoneNumber: "0987654321",
            email: "jane.doe@example.com",
            heathID: 123,
            address: {
                street: "456 Main St",
                postalCode: "54321",
                city: "Othertown",
            },
            password: "securePassword456",
        };

        expect(mapUserRegistration(userRegistrationObj2)).toEqual(expectedDto);
    });

    test("should throw an error for invalid gender values", () => {
        expect(() => mapUserRegistration(userRegistrationObj3)).toThrow("Invalid gender value");
    });
});
