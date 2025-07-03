import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const CustomButtonStyles = () =>
    StyleSheet.create({
        button: {
            backgroundColor: LightTheme.colors.primary,
            padding: 7,
            borderRadius: 8,
            alignItems: "center",
            borderColor: LightTheme.colors.primary,
            alignContent: "center",
            justifyContent: "center",
            gap: 5,
            flexDirection: "row",
        },
        buttonOutline: {
            backgroundColor: "white",
            borderColor: LightTheme.colors.primary,
            borderWidth: 2,
            flexShrink: 1,
        },
        primary: {
            backgroundColor: LightTheme.colors.primary,
        },
        secondary: {
            backgroundColor: LightTheme.colors.secondary,
        },
        link: {
            backgroundColor: LightTheme.colors.link,
        },
        muted: {
            backgroundColor: LightTheme.colors.muted,
        },
    });

export default CustomButtonStyles;
