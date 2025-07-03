import { CodeableConcept, Coding } from "fhir/r4";
import { RaRecord } from "react-admin";

/**
 * Creates a CodeableConcept object with the provided system, code, and text.
 * @param system - The system URI for the coding.
 * @param code - The code for the coding.
 * @param text - The display text for the coding.
 * @returns A CodeableConcept object or undefined.
 */
export function createCodeableConcept(system?: string, code?: string, text?: string): CodeableConcept | undefined {
    return {
        coding: [
            {
                system: system,
                code: code,
                display: text,
            },
        ],
        text: text,
    };
}

/**
 * Retrieves the code from a CodeableConcept object and maps it to a value from the provided enum type.
 * @param code - The CodeableConcept object.
 * @param enumType - The enum type to map the code to.
 * @returns The mapped code as a string.
 */
export const getCodeCodableConcept = <T extends Record<string, string | number>>(
    code?: CodeableConcept,
    enumType?: T,
): string => {
    let displayedCode = "";
    if (code !== undefined) {
        const codings = code.coding;
        if (codings !== undefined) {
            displayedCode = codings
                .map((coding: Coding) => {
                    const codeValue = coding.code ?? "";
                    return enumType ? enumType[codeValue as keyof T] || codeValue : codeValue;
                })
                .join(", ");
        }
    }
    return displayedCode;
};

/**
 * Retrieves the codes from a list of CodeableConcept objects and maps them to values from the provided enum type.
 * @param codes - The list of CodeableConcept objects.
 * @param enumType - The enum type to map the codes to.
 * @returns The mapped codes as a string.
 */
export const getCodeCodeableConceptList = <T extends Record<string, string | number>>(
    codes?: CodeableConcept[],
    enumType?: T,
): string => {
    let displayedCodes: string = "";
    if (codes !== undefined) {
        const displayCodings: string[] = [];
        for (const type of codes) {
            type.coding?.forEach((coding: Coding) => {
                const code = getCodeCodableConcept({ coding: [coding] }, enumType);
                displayCodings.push(code);
            });
        }
        displayedCodes = displayCodings.join(", ");
    }
    return displayedCodes;
};

/**
 * Displays the default organization name from a RaRecord object.
 * @param record - The RaRecord object.
 * @returns The organization name as a string.
 */
export const displayDefaultOrganization = (record: RaRecord): string => {
    let organizationName: string = "";
    if (record?.name) {
        organizationName = record.name;
    }
    return organizationName;
};

/**
 * Displays the human name of a practitioner from a RaRecord object.
 * @param record - The RaRecord object.
 * @returns The practitioner's name as a string.
 */
export const displayFhirHumanName = (record: RaRecord): string => {
    let practitionerName: string = "";
    if (record?.name) {
        practitionerName = record.name[0].given + " " + record.name[0].family;
    }
    return practitionerName;
};

/**
 * Displays the text or code of a CodeableConcept object.
 * @param code - The CodeableConcept object.
 * @returns The display text or code as a string.
 */
export const displayCodeableConcept = (code: CodeableConcept): string => {
    if (!code) {
        return "";
    }
    const codeableConcepts: CodeableConcept[] = Array.isArray(code) ? code : [code];
    const displays = codeableConcepts.map((concept) => {
        if (concept.text) {
            return concept.text;
        }
        const firstCoding = concept.coding?.[0];
        if (firstCoding?.display) {
            return firstCoding.display;
        }
        if (firstCoding?.code) {
            return firstCoding.code;
        }
        return "";
    });
    return displays.filter((display) => display).join(", ");
};

/**
 * Displays the human name of a practitioner from a RaRecord object.
 * @param record - The RaRecord object.
 * @returns The practitioner's name as a string.
 */
export const displayPractitionerName = (record: RaRecord): string => {
    let practitionerName: string = "";
    if (record?.name) {
        practitionerName = record.name[0].given + " " + record.name[0].family;
    }
    return practitionerName;
};
