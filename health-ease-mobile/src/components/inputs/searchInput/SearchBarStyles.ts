import { StyleSheet } from "react-native";
import { rgba } from "polished";
import LightTheme from "@/src/theme/LightTheme";

const SearchBarStyles = () =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: rgba(LightTheme.colors.white, 0.2),
            paddingHorizontal: 10,
            borderRadius: 25,
            borderColor: rgba(LightTheme.colors.white, 0.3),
            borderWidth: 1,
        },
        textInput: {
            flex: 1,
            marginLeft: 10,
            fontSize: 13,
            color: LightTheme.colors.white,
            fontFamily: "PoppinsRegular",
        },
        icon: {
            color: LightTheme.colors.white,
        },
    });

export default SearchBarStyles;
