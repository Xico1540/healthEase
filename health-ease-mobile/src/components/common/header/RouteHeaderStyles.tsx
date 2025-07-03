import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const RouteHeaderStyles = (roundedBottomCorners: boolean) =>
    StyleSheet.create({
        fixedHeader: {
            width: "100%",
            justifyContent: "center",
            paddingVertical: 20,
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
            paddingHorizontal: 10,
        },
        titleText: {
            position: "absolute",
            width: "auto",
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
        backButtonText: {
            color: LightTheme.colors.white,
            fontSize: 16,
            fontFamily: "PoppinsRegular",
        },
        titleContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
    });

export default RouteHeaderStyles;
