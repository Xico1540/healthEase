import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

export const ConfirmationStepStyle = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: LightTheme.colors.white,
        },
        content: {
            flex: 1,
            paddingHorizontal: 40,
            paddingTop: 40,
        },
        buttonContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 20,
        },
        spinner: {
            marginLeft: 10,
        },
    });

export default ConfirmationStepStyle;
