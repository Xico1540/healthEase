import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const AppointmentCardStyles = StyleSheet.create({
    cardContainer: {
        position: "absolute",
        bottom: 0,
        borderColor: "#eaeaea",
        borderWidth: 2,
        borderBottomWidth: 0,
        backgroundColor: LightTheme.colors.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingTop: 10,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: LightTheme.colors.muted,
        height: "80%",
        borderRadius: 20,
        borderWidth: 1,
        bottom: 0,
        position: "absolute",
        width: "100%",
    },
});

export default AppointmentCardStyles;
