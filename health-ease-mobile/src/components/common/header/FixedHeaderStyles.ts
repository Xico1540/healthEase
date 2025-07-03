import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const FixedHeaderStyles = (roundedBottomCorners: boolean) => {
    return StyleSheet.create({
        fixedHeader: {
            width: "100%",
            paddingHorizontal: 20,
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: LightTheme.colors.primary,
            borderBottomStartRadius: roundedBottomCorners ? 30 : undefined,
            borderBottomEndRadius: roundedBottomCorners ? 30 : undefined,
        },
        actionButtonsContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
        },
        titleText: {
            width: "100%",
            textAlign: "center",
            fontSize: 18,
            color: LightTheme.colors.white,
            fontFamily: "PoppinsRegular",
        },
        rightButtonPlaceholder: {
            marginLeft: "auto",
            zIndex: 1,
        },
        leftButtonPlaceholder: {
            marginRight: "auto",
            zIndex: 1,
        },
    });
};

export default FixedHeaderStyles;
