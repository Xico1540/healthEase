/**
 * Options for formatting dates in the format: year, short month, and numeric day.
 */
export const optionsDate: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
};

/**
 * Options for formatting time in the format: 2-digit hour and 2-digit minute.
 */
export const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
};

/**
 * Formats a date string into a localized date string based on the provided options.
 * @param dateString - The date string to format.
 * @param options - The options for formatting the date.
 * @returns The formatted date string.
 */
export const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions) => {
    return new Date(dateString).toLocaleDateString("pt-PT", options);
};

/**
 * Formats a date string into a localized time string based on the provided options.
 * @param dateString - The date string to format.
 * @param options - The options for formatting the time.
 * @returns The formatted time string.
 */
export const formatTime = (dateString: string, options: Intl.DateTimeFormatOptions) => {
    return new Date(dateString).toLocaleTimeString("pt-PT", options);
};

/**
 * Formats a schedule string by combining the start and end date strings into a single string.
 * @param startDateString - The start date string.
 * @param endDateString - The end date string.
 * @returns The formatted schedule string.
 */
export const formatSchedule = (startDateString: string, endDateString: string): string => {
    const date = formatDate(startDateString, { year: "numeric", month: "2-digit", day: "2-digit" });
    const startTime = formatTime(startDateString, { hour: "2-digit", minute: "2-digit" }).replace(":", "h");
    const endTime = formatTime(endDateString, { hour: "2-digit", minute: "2-digit" }).replace(":", "h");

    return `${date} - ${startTime} às ${endTime}`;
};

/**
 * Formats a date string into a combined date and time string.
 * @param dateString - The date string to format.
 * @returns The formatted date and time string.
 */
export const formatDateTime = (dateString: string): string => {
    const date = formatDate(dateString, { year: "numeric", month: "2-digit", day: "2-digit" });
    const time = formatTime(dateString, { hour: "2-digit", minute: "2-digit" }).replace(":", "h");
    return `${date} ${time}`;
};
