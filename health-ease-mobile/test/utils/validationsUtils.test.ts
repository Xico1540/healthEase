import validatePhoneNumber from "@/src/utils/validationsUtils";
import { findPhoneNumbersInText, isPossiblePhoneNumber } from "libphonenumber-js";
import { isNil } from "lodash";

jest.mock("lodash", () => ({
    isNil: jest.fn(),
}));

describe("validatePhoneNumber", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return true for a valid phone number", () => {
        const phoneNumber = "+1234567890";
        const mockNumberData = [{ number: { country: "US" } }];
        (findPhoneNumbersInText as jest.Mock).mockReturnValue(mockNumberData);
        (isNil as unknown as jest.Mock).mockReturnValue(false);
        (isPossiblePhoneNumber as jest.Mock).mockReturnValue(true);

        const result = validatePhoneNumber(phoneNumber);
        expect(result).toBe(true);
        expect(findPhoneNumbersInText).toHaveBeenCalledWith(phoneNumber);
        expect(isPossiblePhoneNumber).toHaveBeenCalledWith(phoneNumber, "US");
    });

    test("should return false for an invalid phone number", () => {
        const phoneNumber = "invalid";
        const mockNumberData = [] as any;
        (findPhoneNumbersInText as jest.Mock).mockReturnValue(mockNumberData);
        (isNil as unknown as jest.Mock).mockReturnValue(true);

        const result = validatePhoneNumber(phoneNumber);
        expect(result).toBe(false);
        expect(findPhoneNumbersInText).toHaveBeenCalledWith(phoneNumber);
    });

    test("should return false if number data is nil", () => {
        const phoneNumber = "+1234567890";
        const mockNumberData = [{ number: { country: "US" } }];
        (findPhoneNumbersInText as jest.Mock).mockReturnValue(mockNumberData);
        (isNil as unknown as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);

        const result = validatePhoneNumber(phoneNumber);
        expect(result).toBe(false);
        expect(findPhoneNumbersInText).toHaveBeenCalledWith(phoneNumber);
    });
});
