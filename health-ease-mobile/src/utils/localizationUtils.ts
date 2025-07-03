import { ICountryCca2 } from "react-native-international-phone-number/lib/interfaces/countryCca2";
import * as Localization from "expo-localization";
import { upperCase } from "lodash";
import { getCode } from "country-list";

export const getDefaultCountryByLocale = (): ICountryCca2 => {
    let countryName = Localization.getLocales()[0].regionCode;
    if (countryName) {
        countryName = upperCase(countryName);
    }

    return countryName as ICountryCca2;
};

const getCountryCodes = (countryNames: string[]): Array<ICountryCca2> =>
    countryNames.map(getCode) as Array<ICountryCca2>;

export const buildPopularCountries = (): Array<ICountryCca2> => {
    const countryNames = [
        "Portugal",
        "Brazil",
        "Angola",
        "Mozambique",
        "Cape Verde",
        "Guinea-Bissau",
        "Switzerland",
        "Spain",
        "United Kingdom",
        "France",
    ];

    return getCountryCodes(countryNames);
};
