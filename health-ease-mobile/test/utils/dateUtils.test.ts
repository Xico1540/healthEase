import {
    formatDateForAppointmentCard,
    formatDateTime,
    formatHourForAppointmentCard,
    getWeekInterval
} from "@/src/utils/dateUtils";


describe('dateUtils', () => {
    describe('formatDateTime', () => {
        test('should format start and end date correctly', () => {
            const result = formatDateTime('2023-10-01T10:00:00Z', '2023-10-01T12:00:00Z');
            expect(result).toEqual({
                day: 'Domingo',
                time: '11:00 AM – 1:00 PM'
            });
        });
    });

    describe('formatDateForAppointmentCard', () => {
        test('should format date correctly', () => {
            const result = formatDateForAppointmentCard('2023-10-01T10:00:00Z');
            expect(result).toBe('Domingo, 1 de outubro');
        });
    });

    describe('formatHourForAppointmentCard', () => {
        test('should format hour correctly', () => {
            const result = formatHourForAppointmentCard('2023-10-01T10:00:00Z');
            expect(result).toBe('11:00');
        });
    });

    describe('getWeekInterval', () => {
        test('should return the start and end of the week', () => {
            const selectedDate = new Date('2023-10-04T10:00:00Z');
            const result = getWeekInterval(selectedDate);
            expect(result.weekStart).toEqual(new Date('2023-10-01T23:00:00Z'));
            expect(result.weekEnd).toEqual(new Date('2023-10-08T22:59:59.999Z'));
        });
    });
});
