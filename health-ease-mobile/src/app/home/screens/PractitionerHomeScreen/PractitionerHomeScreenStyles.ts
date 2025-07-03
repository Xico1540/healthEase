import { StyleSheet } from "react-native";
import { rgba } from "polished";
import LightTheme from "@/src/theme/LightTheme";

const PractitionerHomeScreenStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#F8F9FA",
            margin: 20,
            borderRadius: 20,
        },
        tabs: {
            flexDirection: "row",
            justifyContent: "space-around",
            paddingVertical: 10,
            backgroundColor: "#F8F9FA",
            borderBottomWidth: 2,
            borderBottomColor: "#E0E0E0",
            padding: 10,
            borderTopStartRadius: 20,
            borderTopEndRadius: 20,
        },
        tab: {
            fontSize: 16,
            fontWeight: "bold",
            color: "#A0A0A0",
            marginBottom: -12,
            paddingBottom: 9,
            fontFamily: "PoppinsRegular",
        },
        activeTab: {
            color: LightTheme.colors.primary,
            borderBottomWidth: 2,
            borderBottomColor: LightTheme.colors.success,
            paddingBottom: 9,
            fontFamily: "PoppinsRegular",
        },
        list: {
            padding: 10,
        },
        card: {
            flexDirection: "row",
            backgroundColor: rgba(LightTheme.colors.primary, 0.15),
            borderRadius: 20,
            padding: 15,
            marginVertical: 5,
            alignItems: "center",
            justifyContent: "space-between",
        },
        leftSection: {
            flex: 1,
        },
        name: {
            fontSize: 16,
            fontWeight: "bold",
            color: LightTheme.colors.secondary,
            marginBottom: 10,
            fontFamily: "PoppinsRegular",
        },
        specialty: {
            fontSize: 13,
            color: "#505050",
            fontFamily: "PoppinsRegular",
        },
        day: {
            fontSize: 14,
            color: "#555555",
            marginBottom: 10,
            fontFamily: "PoppinsRegular",
        },
        button: {
            backgroundColor: LightTheme.colors.primary,
            borderRadius: 20,
            paddingHorizontal: 12,
            alignSelf: "flex-start",
            marginTop: 15,
        },
        buttonText: {
            fontSize: 14,
            color: "#FFFFFF",
            fontFamily: "PoppinsRegular",
        },
        rightSection: {
            alignItems: "flex-end",
            justifyContent: "flex-start",
            height: "100%",
        },
        duration: {
            fontSize: 14,
            fontWeight: "bold",
            color: LightTheme.colors.white,
            paddingHorizontal: 9,
            paddingVertical: 8,
            borderRadius: 15,
            backgroundColor: LightTheme.colors.secondary,
            marginBottom: 10,
            fontFamily: "PoppinsRegular",
        },
        image: {
            width: 70,
            height: 70,
            borderRadius: 15,
        },
    });

export default PractitionerHomeScreenStyles;
