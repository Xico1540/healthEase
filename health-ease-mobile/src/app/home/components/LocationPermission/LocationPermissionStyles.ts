import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const AppointmentCardStyles = () =>
    StyleSheet.create({
        permissionContainer: {
            backgroundColor: LightTheme.colors.card,
            padding: 15,
            borderRadius: 8,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 10,
            display: "flex",
            gap: 10,
        },
        customButtonStyle: {
            flex: 1,
        },
        customTextStyle: {
            fontSize: 14,
            fontFamily: "PoppinsRegular",
        },
    });

export default AppointmentCardStyles;
