import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const CalendarAppointmentsStyles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 20,
        paddingBottom: 0,
    },
    title: {
        color: LightTheme.colors.primary,
        fontSize: 20,
        paddingBottom: 20,
    },
    calendar: {
        borderRadius: 10,
    },
});

export default CalendarAppointmentsStyles;
