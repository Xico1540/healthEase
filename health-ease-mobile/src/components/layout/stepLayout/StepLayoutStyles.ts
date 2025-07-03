import { StyleSheet } from "react-native";
import { darken } from "polished";
import LightTheme from "@/src/theme/LightTheme";

const CreateStepLayoutStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        emptyButton: {
            width: 45,
            height: 45,
        },
        content: {
            flex: 1,
            paddingHorizontal: 40,
            paddingTop: 40,
        },
        footer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: LightTheme.colors.muted,
            padding: 15,
            width: "100%",
        },
        pagination: {
            flexDirection: "row",
        },
        dot: {
            width: 8,
            height: 8,
            borderRadius: 5,
            backgroundColor: darken(0.2, LightTheme.colors.muted),
            marginHorizontal: 2,
        },
        activeDot: {
            backgroundColor: LightTheme.colors.primary,
        },
        nextButton: {
            backgroundColor: "#0033A8",
        },
        submitButton: {
            padding: 10,
            backgroundColor: "#28a745",
            borderRadius: 5,
        },
        submitButtonText: {
            color: "#fff",
        },
    });

export default CreateStepLayoutStyles;
