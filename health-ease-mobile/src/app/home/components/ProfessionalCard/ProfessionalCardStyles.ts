import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const ProfessionalCardStyles = () =>
    StyleSheet.create({
        card: {
            flexDirection: "row",
            padding: 15,
            backgroundColor: LightTheme.colors.card,
            borderRadius: 10,
            display: "flex",
            justifyContent: "space-between",
        },
        cardContainer: {
            display: "flex",
            flexDirection: "column",
        },
        image: {
            width: 112,
            height: 112,
            borderRadius: 10,
        },
        infoContainer: {
            justifyContent: "space-between",
        },
        name: {
            fontFamily: "PoppinsSemiBold",
            fontSize: 16,
            color: LightTheme.colors.primary,
        },
        specialty: {
            fontSize: 14,
            color: "#555",
            fontFamily: "PoppinsRegular",
            maxWidth: 200,
        },
        distance: {
            fontSize: 12,
            color: "#888",
            fontFamily: "PoppinsRegular",
            maxWidth: 200,
        },
        fixedButton: {
            alignSelf: "flex-start",
            marginTop: 10,
        },
    });

export default ProfessionalCardStyles;
