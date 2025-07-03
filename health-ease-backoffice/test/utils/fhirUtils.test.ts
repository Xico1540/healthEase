import {
    createCodeableConcept,
    getCodeCodableConcept,
    getCodeCodeableConceptList,
    displayDefaultOrganization,
    displayFhirHumanName,
    displayCodeableConcept,
    displayPractitionerName
} from '../../src/utils/fhirUtils';
import { CodeableConcept } from "fhir/r4";
import { RaRecord } from "react-admin";

describe('fhirUtils', () => {
    describe('createCodeableConcept', () => {
        test('should create a CodeableConcept correctly', () => {
            const system = 'http://loinc.org';
            const code = '1234-5';
            const text = 'Example Code';
            const result = createCodeableConcept(system, code, text);
            expect(result).toEqual({
                coding: [
                    {
                        system: system,
                        code: code,
                        display: text,
                    },
                ],
                text: text,
            });
        });
    });

    describe('getCodeCodableConcept', () => {
        test('should get code from CodeableConcept correctly', () => {
            const codeableConcept: CodeableConcept = {
                coding: [
                    {
                        system: 'http://loinc.org',
                        code: '1234-5',
                        display: 'Example Code',
                    },
                ],
                text: 'Example Code',
            };
            const result = getCodeCodableConcept(codeableConcept);
            expect(result).toBe('1234-5');
        });
    });

    describe('getCodeCodeableConceptList', () => {
        test('should get codes from CodeableConcept list correctly', () => {
            const codeableConcepts: CodeableConcept[] = [
                {
                    coding: [
                        {
                            system: 'http://loinc.org',
                            code: '1234-5',
                            display: 'Example Code 1',
                        },
                    ],
                    text: 'Example Code 1',
                },
                {
                    coding: [
                        {
                            system: 'http://loinc.org',
                            code: '6789-0',
                            display: 'Example Code 2',
                        },
                    ],
                    text: 'Example Code 2',
                },
            ];
            const result = getCodeCodeableConceptList(codeableConcepts);
            expect(result).toBe('1234-5, 6789-0');
        });
    });

    describe('displayDefaultOrganization', () => {
        test('should display default organization name correctly', () => {
            const record: RaRecord = { id: 1, name: 'Test Organization' };
            const result = displayDefaultOrganization(record);
            expect(result).toBe('Test Organization');
        });
    });

    describe('displayFhirHumanName', () => {
        test('should display FHIR human name correctly', () => {
            const record: RaRecord = { id: 1, name: [{ given: 'John', family: 'Doe' }] };
            const result = displayFhirHumanName(record);
            expect(result).toBe('John Doe');
        });
    });

    describe('displayCodeableConcept', () => {
        test('should display CodeableConcept correctly', () => {
            const codeableConcept: CodeableConcept = {
                coding: [
                    {
                        system: 'http://loinc.org',
                        code: '1234-5',
                        display: 'Example Code',
                    },
                ],
                text: 'Example Code',
            };
            const result = displayCodeableConcept(codeableConcept);
            expect(result).toBe('Example Code');
        });
    });

    describe('displayPractitionerName', () => {
        test('should display practitioner name correctly', () => {
            const record: RaRecord = { id: 1, name: [{ given: 'Jane', family: 'Smith' }] };
            const result = displayPractitionerName(record);
            expect(result).toBe('Jane Smith');
        });
    });
});
