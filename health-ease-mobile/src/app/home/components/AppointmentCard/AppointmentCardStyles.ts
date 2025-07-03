import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const AppointmentCardStyles = () =>
    StyleSheet.create({
        timeCard: {
            backgroundColor: LightTheme.colors.secondary,
            display: "flex",
            justifyContent: "center",
            width: 85,
            height: 85,
            borderRadius: 10,
        },
        card: {
            backgroundColor: LightTheme.colors.primary,
            padding: 15,
            borderRadius: 10,
            height: "auto",
            flexDirection: "row",
            gap: 10,
        },
        date: {
            color: "#fff",
            fontSize: 18,
            textAlign: "center",
            fontFamily: "PoppinsSemiBold",
        },
        time: {
            color: "#fff",
            fontSize: 16,
            fontFamily: "PoppinsRegular",
        },
        doctorName: {
            color: "#fff",
            fontSize: 18,
            fontFamily: "PoppinsSemiBold",
        },
        issue: {
            color: "#fff",
            fontSize: 14,
            fontFamily: "PoppinsRegular",
        },
    });

export default AppointmentCardStyles;
