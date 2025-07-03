import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const HomeScreenStyles = () =>
    StyleSheet.create({
        headerContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        logo: {
            width: 165,
            height: 35,
        },
        iconContainer: {
            flexDirection: "row",
        },
        icon: {
            width: 35,
            height: 35,
            marginHorizontal: 5,
            borderRadius: 25,
        },
        menuItem: {
            backgroundColor: LightTheme.colors.error,
            padding: 10,
        },
        menuText: {
            fontSize: 16,
        },
    });

export default HomeScreenStyles;
