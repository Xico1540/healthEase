import { getEnumAsChoices, getChoiceValue, getSpecialitiesAsChoices } from '../../src/utils/reactAdminUtils';
import specialtiesValueSetMock from '../../src/mockData/valueSets/SpecialtiesMock';

describe('reactAdminUtils', () => {
    describe('getEnumAsChoices', () => {
        test('should convert enum to choices correctly', () => {
            enum TestEnum {
                OPTION_ONE = 'Option One',
                OPTION_TWO = 'Option Two',
            }
            const choices = getEnumAsChoices(TestEnum);
            expect(choices).toEqual([
                { id: 'OPTION_ONE', name: 'Option One' },
                { id: 'OPTION_TWO', name: 'Option Two' },
            ]);
        });
    });

    describe('getChoiceValue', () => {
        test('should get choice value correctly', () => {
            const enumType = {
                OPTION_ONE: 'Option One',
                OPTION_TWO: 'Option Two',
            };
            const value = 'OPTION_ONE';
            const choiceValue = getChoiceValue(value, enumType);
            expect(choiceValue).toBe('Option One');
        });

        test('should return empty string if value is not in enum', () => {
            const enumType = {
                OPTION_ONE: 'Option One',
                OPTION_TWO: 'Option Two',
            };
            const value = 'OPTION_THREE';
            const choiceValue = getChoiceValue(value, enumType);
            expect(choiceValue).toBe('');
        });
    });

    describe('getSpecialitiesAsChoices', () => {
        test('should get specialties as choices correctly', () => {
            const specialties = getSpecialitiesAsChoices();
            expect(specialties).toEqual(
                specialtiesValueSetMock.compose.include[0].concept.map((item: { code: string; display: string }) => ({
                    code: item.code,
                    display: item.display,
                }))
            );
        });
    });
});
