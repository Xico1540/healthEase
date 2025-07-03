import { StyleSheet } from "react-native";

export const HealthcareStyle = () =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        addButton: {
            backgroundColor: "#2563EB",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            alignItems: "center",
            marginTop: 20,
        },
        addButtonText: {
            color: "white",
            fontWeight: "bold",
        },
        cardContainer: {
            width: "100%",
            marginBottom: 20,
            alignItems: "center",
        },
        card: {
            width: "100%",
            height: 200,
            borderWidth: 2,
            borderColor: "#dae6e7",
            borderRadius: 10,
        },
    });

export default HealthcareStyle;
