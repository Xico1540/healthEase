import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const AppointmentListStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    consultationsContainer: {
        gap: 10,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    card: {
        backgroundColor: LightTheme.colors.background,
        padding: 10,
        borderRadius: 10,
        margin: 10,
    },
    header: {
        fontSize: 18,
        marginBottom: 10,
        color: LightTheme.colors.primary,
    },
    consultationItem: {
        backgroundColor: LightTheme.colors.card,
        borderRadius: 10,
        padding: 15,
    },
    dateTimeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dateTimeColumn: {
        flexDirection: "column",
    },
    date: {
        color: LightTheme.colors.secondary,
        fontFamily: "PoppinsMedium",
        fontSize: 16,
    },
    time: {
        color: LightTheme.colors.primary,
        fontFamily: "PoppinsMedium",
        fontSize: 15,
    },
    description: {
        color: "#333333",
        fontFamily: "PoppinsMedium",
        fontSize: 15,
        maxWidth: 180,
    },
    doctor: {
        color: "#333333",
        fontFamily: "PoppinsSemiBold",
        fontSize: 15,
        maxWidth: 180,
    },
    detailsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    detailsRow1: {
        alignContent: "flex-start",
        alignItems: "flex-start",
    },
    detailsRow2: {
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    duration: {
        fontSize: 16,
        paddingRight: 10,
        fontFamily: "PoppinsSemiBold",
        color: LightTheme.colors.info,
    },
    moreIcon: {
        fontSize: 20,
        color: LightTheme.colors.muted,
    },
    noAppointmentsTextContainer: {
        borderColor: LightTheme.colors.primary,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    noAppointmentsText: {
        color: LightTheme.colors.secondary,
        fontFamily: "PoppinsRegular",
        fontSize: 14,
    },
});

export default AppointmentListStyles;
