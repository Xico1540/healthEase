import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const AvailabilityCardStyles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
        height: "auto",
        backgroundColor: LightTheme.colors.card,
        borderRadius: 22,
        padding: 10,
        paddingHorizontal: 20,
        shadowColor: LightTheme.colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginTop: -40,
    },
    title: {
        fontFamily: "PoppinsRegular",
        fontSize: 16,
        lineHeight: 30,
        color: LightTheme.colors.secondary,
    },
    scheduleList: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginTop: 10,
    },
    scheduleItem: {
        display: "flex",
        flexDirection: "column",
        padding: 10,
        borderColor: LightTheme.colors.primary,
        borderRadius: 10,
        borderWidth: 2,
        opacity: 1,
        backgroundColor: LightTheme.colors.white,
    },
    selectedItem: {
        backgroundColor: LightTheme.colors.primary,
    },
    selectedText: {
        color: LightTheme.colors.muted,
    },
    day: {
        fontSize: 16,
        color: LightTheme.colors.secondary,
    },
    time: {
        fontSize: 16,
    },
    canceled: {
        textDecorationLine: "line-through",
        color: LightTheme.colors.error,
    },
    picker: {
        marginVertical: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 8,
        color: "#333",
    },
    pickerWithBorder: {
        borderWidth: 2,
        borderRadius: 8,
        borderColor: LightTheme.colors.secondary,
        backgroundColor: LightTheme.colors.white,
    },
    pickerContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        borderColor: "rgba(20,71,93,0.2)",
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    label: {
        fontSize: 15,
        color: LightTheme.colors.secondary,
    },
    datePickerContainer: {
        width: "100%",
    },
    weekLabel: {
        fontSize: 14,
        color: LightTheme.colors.secondary,
    },
    slotContainer: {
        display: "flex",
        flexDirection: "column",
        borderWidth: 1,
        borderColor: "rgba(20,71,93,0.2)",
        padding: 10,
        borderRadius: 10,
        marginTop: 5,
        gap: 10,
    },
    selectedSlot: {
        backgroundColor: LightTheme.colors.primary,
        borderColor: LightTheme.colors.primary,
        borderWidth: 2,
    },
    rowContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    columnContainer: {
        display: "flex",
        flexDirection: "column",
    },
    mutedSlot: {
        backgroundColor: "rgba(51,134,175,0.2)",
        borderColor: "rgba(51,134,175,0.2)",
        borderWidth: 1,
    },
    mutedText: {
        color: "rgba(32,85,110,0.2)",
    },
});

export default AvailabilityCardStyles;
