import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const DefaultHeaderStyles = StyleSheet.create({
    header: {
        backgroundColor: LightTheme.colors.primary,
        height: 120,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        paddingTop: 50,
        paddingBottom: 10,
    },
    title: {
        color: "white",
        fontSize: 18,
    },
    iconButton: {
        padding: 10,
        backgroundColor: LightTheme.colors.secondary,
        borderRadius: 32,
        marginLeft: 10,
        marginRight: 10,
    },
});

export default DefaultHeaderStyles;
