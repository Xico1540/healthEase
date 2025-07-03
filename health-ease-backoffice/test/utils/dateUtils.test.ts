import { optionsDate, optionsTime, formatDate, formatTime, formatSchedule, formatDateTime } from '../../src/utils/dateUtils';

describe('dateUtils', () => {
    describe('formatDate', () => {
        test('should format date correctly', () => {
            const date = '2023-10-05';
            const formattedDate = formatDate(date, optionsDate);
            expect(formattedDate).toBe('5/10/2023');
        });
    });

    describe('formatTime', () => {
        test('should format time correctly', () => {
            const date = '2023-10-05T14:30:00';
            const formattedTime = formatTime(date, optionsTime);
            expect(formattedTime).toBe('14:30');
        });
    });

    describe('formatSchedule', () => {
        test('should format schedule correctly', () => {
            const startDate = '2023-10-05T14:30:00';
            const endDate = '2023-10-05T16:30:00';
            const formattedSchedule = formatSchedule(startDate, endDate);
            expect(formattedSchedule).toBe('05/10/2023 - 14h30 às 16h30');
        });
    });

    describe('formatDateTime', () => {
        test('should format date and time correctly', () => {
            const date = '2023-10-05T14:30:00';
            const formattedDateTime = formatDateTime(date);
            expect(formattedDateTime).toBe('05/10/2023 14h30');
        });
    });
});
