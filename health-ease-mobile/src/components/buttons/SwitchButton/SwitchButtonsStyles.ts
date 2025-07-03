import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const SwitchButtonsStyles = () =>
    StyleSheet.create({
        horizontalContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
            marginTop: 5,
            marginBottom: 20,
        },
        button: {
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: "center",
            minHeight: 45,
            flexGrow: 1,
            borderWidth: 0,
            backgroundColor: LightTheme.colors.muted,
        },
        buttonSelected: {
            borderWidth: 1,
            borderColor: LightTheme.colors.primary,
            backgroundColor: LightTheme.colors.white,
        },
        buttonText: {
            fontSize: 16,
            fontFamily: "PoppinsRegular",
            color: LightTheme.colors.text,
        },
        buttonTextSelected: {
            color: LightTheme.colors.primary,
            fontFamily: "PoppinsMedium",
        },
    });

export default SwitchButtonsStyles;
