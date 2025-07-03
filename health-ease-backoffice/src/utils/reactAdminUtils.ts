import specialtiesValueSetMock from "../mockData/valueSets/SpecialtiesMock";

/**
 * Converts an enum type to an array of choices for use in a select input.
 * @param enumType - The enum type to convert.
 * @returns An array of choices with id and name properties.
 */
export function getEnumAsChoices<T>(enumType: T) {
    const choices = [];
    for (const key in enumType) {
        choices.push({
            id: key,
            name: enumType[key as keyof T],
        });
    }
    return choices;
}

/**
 * Retrieves the value of a choice from an enum type.
 * @param value - The value to retrieve.
 * @param enumType - The enum type to retrieve the value from.
 * @returns The choice value as a string.
 */
export function getChoiceValue<T extends Record<string, string | number>>(value: string, enumType: T): string {
    let choiceValue = "";
    const enumValue = enumType[value as keyof T];
    choiceValue = enumValue !== undefined ? String(enumValue) : "";
    return choiceValue;
}

/**
 * Retrieves the specialties as choices from the mock data.
 * @returns An array of specialties with code and display properties.
 */
export function getSpecialitiesAsChoices() {
    return specialtiesValueSetMock.compose.include[0].concept.map((item: { code: string; display: string }) => ({
        code: item.code,
        display: item.display,
    }));
}
