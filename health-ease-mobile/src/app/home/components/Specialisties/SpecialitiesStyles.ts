import { StyleSheet } from "react-native";

const SpecialitiesStyles = () =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            marginVertical: 10,
        },
        tag: {
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 15,
            marginRight: 10,
            borderWidth: 1,
        },
    });

export default SpecialitiesStyles;
