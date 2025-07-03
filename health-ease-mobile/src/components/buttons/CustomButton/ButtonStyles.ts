import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const ButtonStyles = () => {
    return StyleSheet.create({
        spinner: {
            marginLeft: 10,
        },
        buttonLayout: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 15,
            width: "100%",
        },
        buttonContainer: {
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 45,
            width: "100%",
        },
        primary: {
            backgroundColor: LightTheme.colors.primary,
        },
        secondary: {
            backgroundColor: LightTheme.colors.secondary,
        },
        tertiary: {
            backgroundColor: LightTheme.colors.secondaryText,
        },
        muted: {
            backgroundColor: LightTheme.colors.muted,
        },
        link: {
            backgroundColor: LightTheme.colors.link,
        },
        error: {
            backgroundColor: LightTheme.colors.error,
        },
        icon: {
            flexDirection: "row",
            alignItems: "center",
        },
        iconText: {
            marginLeft: 10,
        },
        text: {
            fontSize: 14,
            fontFamily: "PoppinsRegular",
            alignSelf: "center",
        },
    });
};

export default ButtonStyles;
