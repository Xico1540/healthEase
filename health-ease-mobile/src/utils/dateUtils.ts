import { format, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { pt } from "date-fns/locale";

export const formatDateTime = (start: string, end: string) => {
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    const day =
        format(startDate, "EEEE", { locale: pt }).charAt(0).toUpperCase() +
        format(startDate, "EEEE", { locale: pt }).slice(1);
    const time = `${format(startDate, "h:mm a", { locale: pt })} – ${format(endDate, "h:mm a", { locale: pt })}`;
    return { day, time };
};

export const formatDateForAppointmentCard = (date: string) => {
    const parsedDate = parseISO(date);
    const formattedDate = format(parsedDate, "EEEE, d 'de' MMMM", { locale: pt });
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

export const formatHourForAppointmentCard = (date: string) => {
    const parsedDate = parseISO(date);
    return format(parsedDate, "HH:mm", { locale: pt });
};

export const getWeekInterval = (selectedDate: Date) => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return { weekStart, weekEnd };
};
