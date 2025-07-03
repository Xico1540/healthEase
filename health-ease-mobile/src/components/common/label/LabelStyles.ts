import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const LabelStyles = () =>
    StyleSheet.create({
        label: {
            alignSelf: "flex-start",
            textAlign: "left",
            color: LightTheme.colors.secondaryText,
            fontFamily: "PoppinsRegular",
        },
    });

export default LabelStyles;
