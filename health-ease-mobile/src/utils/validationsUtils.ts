import { CountryCode, findPhoneNumbersInText, isPossiblePhoneNumber, NumberFound } from "libphonenumber-js";
import { isNil } from "lodash";

const validatePhoneNumber = (phoneNumber: string): boolean => {
    const numberData: NumberFound[] = findPhoneNumbersInText(phoneNumber);
    let countryCode: CountryCode;
    if (!isNil(numberData[0]) && !isNil(numberData[0].number) && !isNil(numberData[0].number.country)) {
        countryCode = numberData[0].number.country;
        return isPossiblePhoneNumber(phoneNumber, countryCode);
    }
    return false;
};

export default validatePhoneNumber;
