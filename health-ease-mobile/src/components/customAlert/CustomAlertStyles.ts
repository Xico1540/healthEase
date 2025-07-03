import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const CreateModalAlertStyles = () => {
    const alertTextColor = LightTheme.colors.text;

    const commonStyles = StyleSheet.create({
        modalContainer: {
            width: "90%",
            backgroundColor: LightTheme.colors.background,
            borderRadius: 20,
            padding: 20,
            alignItems: "center",
            alignSelf: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        iconContainer: {
            borderRadius: 100,
            padding: 10,
            marginRight: 0,
        },
        icon: {
            fontSize: 50,
        },
        textContainer: {
            alignItems: "center",
            marginBottom: 20,
        },
        titleText: {
            fontFamily: "PoppinsMedium",
            fontSize: 22,
            textAlign: "center",
        },
        messageText: {
            fontFamily: "PoppinsRegular",
            fontSize: 14,
            color: alertTextColor,
            textAlign: "center",
        },
        helperErrorText: {
            fontFamily: "PoppinsMedium",
            fontSize: 10,
            color: alertTextColor,
            textAlign: "center",
            alignSelf: "center",
        },
        additionalContentContainer: {
            width: "100%",
            marginTop: 5,
            alignItems: "center",
            justifyContent: "center",
        },
        button: {
            flex: 1,
            margin: 5,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 10,
            borderRadius: 20,
            minHeight: 40,
            borderWidth: 1,
        },
        confirmButton: {
            backgroundColor: LightTheme.colors.primary,
            borderColor: LightTheme.colors.primary,
        },
        cancelButton: {
            backgroundColor: LightTheme.colors.background,
            borderColor: LightTheme.colors.primary,
        },
        confirmButtonText: {
            fontFamily: "PoppinsMedium",
            fontSize: 12,
            color: LightTheme.colors.white,
            textAlign: "center",
        },
        cancelButtonText: {
            fontFamily: "PoppinsMedium",
            fontSize: 12,
            color: LightTheme.colors.primary,
            textAlign: "center",
        },
        backdrop: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 1000,
        },
    });

    const dialogStyles = StyleSheet.create({
        contentContainer: {
            alignItems: "center",
            marginBottom: 10,
        },
    });

    const alertStyles = StyleSheet.create({
        contentContainer: {
            alignItems: "center",
            marginBottom: 0,
        },
    });

    return { commonStyles, dialogStyles, alertStyles };
};

export default CreateModalAlertStyles;
