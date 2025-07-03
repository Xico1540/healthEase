import { StyleSheet } from "react-native";

const CommonStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "white",
        },
        mainContent: {
            borderRadius: 8,
            paddingHorizontal: 20,
            paddingBottom: 20,
            flex: 1,
        },
        headerPosition: {
            flex: 1,
        },
        scrollViewContainer: {
            flex: 1,
        },
        fixedHeaderWrapper: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
        },
        scrollContent: {
            flex: 1,
        },
        userSection: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            paddingRight: 10,
            backgroundColor: "grey",
            borderRadius: 50,
        },
        userImage: {
            borderRadius: 50,
            width: 40,
            height: 40,
        },
    });

export default CommonStyles;
