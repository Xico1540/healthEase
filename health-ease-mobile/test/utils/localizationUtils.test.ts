import { getDefaultCountryByLocale, buildPopularCountries } from "@/src/utils/localizationUtils";
import * as Localization from "expo-localization";
import { getCode } from "country-list";

describe("localizationUtils", () => {
    describe("getDefaultCountryByLocale", () => {
        test("should return the default country by locale", () => {
            (Localization.getLocales as jest.Mock).mockReturnValue([{ regionCode: "PT" }]);
            const result = getDefaultCountryByLocale();
            expect(result).toBe("PT");
        });

        test("should return the default country in uppercase", () => {
            (Localization.getLocales as jest.Mock).mockReturnValue([{ regionCode: "pt" }]);
            const result = getDefaultCountryByLocale();
            expect(result).toBe("PT");
        });
    });

    describe("buildPopularCountries", () => {
        test("should return the popular countries' codes", () => {
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
            (getCode as jest.Mock).mockImplementation((name) => name.slice(0, 2).toUpperCase());
            const result = buildPopularCountries();
            expect(result).toEqual(countryNames.map((name) => name.slice(0, 2).toUpperCase()));
        });
    });
});
