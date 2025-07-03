import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const useDatePickerStyles = () =>
    StyleSheet.create({
        container: {
            marginBottom: 10,
            gap: 5,
        },
        button: {
            backgroundColor: LightTheme.colors.muted,
            borderWidth: 0,
            height: 45,
        },
        buttonLayout: {
            alignItems: "center",
            justifyContent: "space-between",
        },
        datePicker: {
            backgroundColor: LightTheme.colors.background,
        },
        modalContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        modalContent: {
            backgroundColor: LightTheme.colors.background,
            padding: 20,
            borderRadius: 10,
            width: "80%",
        },
        modalButtons: {
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 20,
        },
    });

export default useDatePickerStyles;
