import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const UserProfileStyles = () =>
    StyleSheet.create({
        scrollViewContainer: {
            flex: 1,
        },
        dynamicHeader: {
            width: "100%",
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: LightTheme.colors.primary,
            borderBottomStartRadius: 50,
            borderBottomEndRadius: 50,
        },
        userProfileContainer: {
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        },
        profileImage: {
            width: 120,
            height: 120,
            borderRadius: 60,
        },
        labelsContainer: {
            marginBottom: 10,
        },
        labelValueText: {
            fontFamily: "PoppinsMedium",
            fontSize: 15,
            color: LightTheme.colors.primary,
        },
        formContent: {
            width: "100%",
            flexDirection: "column",
            backgroundColor: "rgba(196,196,196,0.1)",
            borderRadius: 22,
            padding: 15,
            gap: 3,
        },
        cardContainer: {
            marginTop: 20,
            marginBottom: 10,
        },
        titleText: {
            marginTop: 15,
            fontSize: 30,
            color: LightTheme.colors.white,
            fontFamily: "PoppinsBold",
            marginBottom: 15,
        },
        titleContainer: {
            marginLeft: 8,
        },
        pickerContainer: {
            flex: 1,
            marginBottom: 15,
        },
        selectBox: {
            borderRadius: 5,
            height: 45,
            borderWidth: 0,
            backgroundColor: LightTheme.colors.muted,
            color: LightTheme.colors.black,
            justifyContent: "center",
        },
        imageWrapper: {
            position: "relative",
        },
        removeIcon: {
            backgroundColor: LightTheme.colors.error,
            borderRadius: 50,
            position: "absolute",
            top: 0,
            left: 0,
            shadowColor: LightTheme.colors.black,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 50,
            elevation: 5,
        },
        editIcon: {
            backgroundColor: LightTheme.colors.white,
            borderRadius: 50,
            position: "absolute",
            top: 0,
            right: 0,
            shadowColor: LightTheme.colors.black,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 50,
            elevation: 5,
            padding: 5,
        },
        buttonLayout: {
            display: "flex",
            flexDirection: "row-reverse",
            gap: 5,
        },
        helperMessageText: {
            paddingRight: 12,
            color: LightTheme.colors.secondaryText,
            fontSize: 12,
        },
        underline: {
            textDecorationLine: "underline",
        },
        modalContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
        modalBackground: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
        modalImage: {
            width: 300,
            height: 300,
            resizeMode: "contain",
            borderRadius: 10,
        },
    });

export default UserProfileStyles;
