import PractitionerRoleController from "../../src/controllers/PractitionerRoleController";

describe('PractitionerRoleController', () => {
    describe('transformList', () => {
        it('should transform an array of data correctly', () => {
            const input = [
                {
                    practitioner: { reference: 'Practitioner/123' },
                    organization: { reference: 'Organization/456' },
                    location: [
                        { reference: 'Location/789' },
                        { reference: 'Location/101' },
                    ],
                    specialty: [
                        {
                            coding: [
                                { code: 'specialty1', display: 'Specialty One' },
                                { code: 'specialty2', display: 'Specialty Two' },
                            ],
                        },
                    ],
                },
            ];
            const result = PractitionerRoleController.transformList(input);

            expect(result[0].processedPractitioner).toBe('123');
            expect(result[0].processedOrganization).toBe('456');
            expect(result[0].processedLocation).toEqual(['789', '101']);
            expect(result[0].processedSpecialty).toEqual([
                { code: 'specialty1', display: 'Specialty One' },
                { code: 'specialty2', display: 'Specialty Two' },
            ]);
        });
    });

    describe('transformShow', () => {
        it('should correctly transform a single data object', () => {
            const input = {
                practitioner: { reference: 'Practitioner/123' },
                organization: { reference: 'Organization/456' },
                location: [{ reference: 'Location/789' }],
                specialty: [
                    {
                        coding: [
                            { code: 'specialty1', display: 'Specialty One' },
                        ],
                    },
                ],
            };

            const result = PractitionerRoleController.transformShow(input);

            expect(result.processedPractitioner).toBe('123');
            expect(result.processedOrganization).toBe('456');
            expect(result.processedLocation).toEqual(['789']);
            expect(result.processedSpecialty).toEqual([
                { code: 'specialty1', display: 'Specialty One' },
            ]);
        });
    });

    describe('transformCreate', () => {
        it('should transform form data into a PractitionerRole object', async () => {
            const input = {
                practitioner: '123',
                organization: '456',
                location: ['789', '101'],
                specialty: ['specialty1'],
                availableTime: [
                    {
                        daysOfWeek: ['monday'],
                        availablestarttime: '2024-11-29T09:00:00Z',
                        availableendtime: '2024-11-29T17:00:00Z',
                    },
                ],
            } as never;

            const result = await PractitionerRoleController.transformCreate(input);

            expect(result?.practitioner?.reference).toBe('Practitioner/123');
            expect(result?.organization?.reference).toBe('Organization/456');
            expect(result.location).toEqual([
                { reference: 'Location/789' },
                { reference: 'Location/101' },
            ]);
            expect(result?.specialty?.[0]?.coding?.[0]?.code ?? '').toBe('specialty1');
            expect(result?.availableTime?.[0]?.daysOfWeek ?? []).toEqual(['monday']);
            expect(result?.availableTime?.[0]?.availableStartTime ?? '').toBe('09:00 AM');
            expect(result?.availableTime?.[0]?.availableEndTime ?? '').toBe('05:00 PM');
        });
    });

    describe('transformEdit', () => {
        it('should transform form data correctly for editing', async () => {
            const input = {
                processedPractitioner: '123',
                processedOrganization: '456',
                processedLocation: ['789'],
                processedSpecialty: [
                    { code: 'specialty1', display: 'Specialty One' },
                ],
                processedAvailableTime: [
                    {
                        daysOfWeek: ['monday'],
                        availableStartTime: '2024-11-29T09:00:00Z',
                        availableEndTime: '2024-11-29T17:00:00Z',
                    },
                ],
            } as never;

            const result = await PractitionerRoleController.transformEdit(input);

            expect(result.practitioner.reference).toBe('Practitioner/123');
            expect(result.organization.reference).toBe('Organization/456');
            expect(result.location).toEqual([{ reference: 'Location/789' }]);
            expect(result.specialty[0].coding[0].code).toBe('specialty1');
            expect(result.availableTime[0].daysOfWeek).toEqual(['monday']);
            expect(result.availableTime[0].availableStartTime).toBe('09:00 AM');
            expect(result.availableTime[0].availableEndTime).toBe('05:00 PM');
            expect(result.processedPractitioner).toBeUndefined();
            expect(result.processedOrganization).toBeUndefined();
        });
    });
});
