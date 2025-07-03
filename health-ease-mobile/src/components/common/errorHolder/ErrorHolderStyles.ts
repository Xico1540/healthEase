import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const ErrorHolderStyles = () =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 5,
            gap: 5,
        },
        icon: {
            marginRight: 5,
        },
        errorText: {
            color: LightTheme.colors.error,
            fontSize: 14,
        },
    });

export default ErrorHolderStyles;
