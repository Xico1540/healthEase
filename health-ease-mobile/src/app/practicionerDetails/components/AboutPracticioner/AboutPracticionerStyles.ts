import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const AboutPracticionerStyles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
        backgroundColor: LightTheme.colors.secondary,
        borderRadius: 22,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        paddingHorizontal: 20,
        padding: 20,
        paddingBottom: 50,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: LightTheme.colors.white,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: LightTheme.colors.white,
        lineHeight: 24,
    },
});

export default AboutPracticionerStyles;
