import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const HelperHolderStyles = () => {
    return StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 5,
            gap: 5,
        },
        icon: {
            marginRight: 5,
        },
        messageText: {
            color: LightTheme.colors.text,
            fontSize: 12,
            flexShrink: 1,
        },
    });
};

export default HelperHolderStyles;
