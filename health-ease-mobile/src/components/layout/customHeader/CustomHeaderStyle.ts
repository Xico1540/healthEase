import { StyleSheet } from "react-native";

const CreateCustomHeaderStyles = () =>
    StyleSheet.create({
        container: {
            justifyContent: "center",
            alignItems: "center",
        },
        text: {
            fontFamily: "PoppinsRegular",
            fontSize: 18,
            color: "white",
            textAlign: "center",
        },
    });

export default CreateCustomHeaderStyles;
