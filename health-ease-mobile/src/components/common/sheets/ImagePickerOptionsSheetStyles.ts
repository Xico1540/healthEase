import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

export const ImagePickerOptionsSheetStyles = () =>
    StyleSheet.create({
        container: {
            padding: 20,
        },
        button: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: LightTheme.colors.background,
            borderColor: LightTheme.colors.primary,
            borderWidth: 1,
            borderRadius: 8,
            padding: 15,
            marginVertical: 8,
        },
        buttonText: {
            color: LightTheme.colors.primary,
            fontSize: 16,
            marginLeft: 10,
            fontFamily: "PoppinsMedium",
        },
    });

export default ImagePickerOptionsSheetStyles;
