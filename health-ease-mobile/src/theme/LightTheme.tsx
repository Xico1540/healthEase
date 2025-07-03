import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";
import { DefaultTheme as PaperDefaultTheme } from "react-native-paper";
import merge from "deepmerge";

const LightTheme = {
    ...merge(NavigationDefaultTheme, PaperDefaultTheme),
    colors: {
        ...NavigationDefaultTheme.colors,
        primary: "#3386AF",
        secondary: "#10495E",
        link: "#2563EB",
        background: "#ffffff",
        card: "#F8F9FA",
        text: "#000000",
        border: "#cccccc",
        notification: "#ff3b30",
        error: "#F24C05",
        warning: "#ff9800",
        info: "#2095ff",
        success: "#0dad4c",
        primaryText: "#000000",
        secondaryText: "#898A8A",
        white: "#ffffff",
        black: "#000000",
        muted: "#F5F5F5",
    },
};

export default LightTheme;
