import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const HomeScreenStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "white",
            gap: 10,
        },
        scrollViewContent: {
            flexGrow: 1,
            display: "flex",
            gap: 10,
            paddingHorizontal: 20,
        },
        cardsContainer: {
            display: "flex",
            gap: 10,
        },
        noPractitionersTextContainer: {
            borderColor: LightTheme.colors.primary,
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
        },
        noPractitionersText: {
            color: LightTheme.colors.secondary,
            fontFamily: "PoppinsRegular",
            fontSize: 14,
        },
    });

export default HomeScreenStyles;
