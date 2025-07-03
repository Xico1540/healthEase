import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const RoundedButtonStyles = () =>
    StyleSheet.create({
        textButton: {
            paddingVertical: 5,
            paddingLeft: 10,
            paddingRight: 10,
            justifyContent: "center",
            alignItems: "flex-start",
            width: "auto",
        },
        roundedButton: {
            borderWidth: 1,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            width: 45,
            height: 45,
        },
        primary: {
            backgroundColor: LightTheme.colors.primary,
            borderColor: LightTheme.colors.primary,
        },
        secondary: {
            backgroundColor: LightTheme.colors.secondary,
            borderColor: LightTheme.colors.secondary,
        },
        muted: {
            backgroundColor: LightTheme.colors.white,
            borderColor: LightTheme.colors.primary,
        },
        small: {
            paddingVertical: 5,
            paddingHorizontal: 10,
        },
        large: {
            paddingVertical: 5,
            paddingHorizontal: 10,
            width: "auto",
        },
        icon: {
            flexDirection: "row",
            alignItems: "center",
        },
        text: {
            fontSize: 14,
            fontFamily: "PoppinsRegular",
        },
        contentContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
        },
    });

export default RoundedButtonStyles;
