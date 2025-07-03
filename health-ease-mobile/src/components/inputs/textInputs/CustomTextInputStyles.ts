import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const CreateCustomTextInputStyles = () =>
    StyleSheet.create({
        container: {
            marginBottom: 20,
            width: "100%",
        },
        label: {
            marginBottom: 5,
            fontFamily: "PoppinsRegular",
        },
        charContainer: {
            flex: 1,
            alignItems: "flex-end",
        },
        input: {
            padding: 10,
            borderRadius: 5,
            height: 45,
            borderWidth: 0,
            backgroundColor: LightTheme.colors.muted,
            color: LightTheme.colors.text,
        },
        textArea: {
            textAlignVertical: "top",
            height: 150,
        },
        helperContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
        },
        charCount: {
            textAlign: "right",
            fontFamily: "PoppinsRegular",
            fontSize: 12,
        },
    });

export default CreateCustomTextInputStyles;
