import { StyleSheet } from "react-native";
import { rgba } from "polished";
import LightTheme from "@/src/theme/LightTheme";

const styles = StyleSheet.create({
    actionSheetContainer: {
        flex: 1,
        backgroundColor: LightTheme.colors.white,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22
    },
    scrollView: {
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 10
    },
    headerDetails: {
        display: "flex",
        flexDirection: "row",
        width: "100%"
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 32,
        marginRight: 16
    },
    headerInfo: {
        display: "flex",
        flexDirection: "column",
        flex: 1
    },
    InfoCard: {
        backgroundColor: rgba(LightTheme.colors.primary, 0.05),
        padding: 10,
        borderRadius: 10,
        width: "100%"
    },
    infoGroup: {
        flexDirection: "column"
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: LightTheme.colors.secondary
    },
    info: {
        fontSize: 14,
        color: "#555"
    },
    highlightedInfo: {
        fontSize: 14,
        color: LightTheme.colors.primary,
        fontFamily: "PoppinsSemiBold"
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 10,
        display: "flex"
    },
    historyItem: {
        padding: 10,
        borderBottomColor: LightTheme.colors.border,
        borderBottomWidth: 1
    },
    historyDate: {
        fontSize: 16,
        fontWeight: "bold",
        color: LightTheme.colors.primary
    },
    historyTime: {
        fontSize: 14,
        color: LightTheme.colors.secondary
    },
    historyDetails: {
        fontSize: 14,
        color: LightTheme.colors.text
    },
    detail: {
        fontSize: 14,
        color: "#333",
        marginBottom: 5
    },
    mapContainer: {
        borderRadius: 20,
        overflow: "hidden",
        marginTop: 10
    },
    map: {
        height: 200,
        width: "100%"
    },
    buttonContainer: {
        width: 200,
        borderRadius: 125,
        alignSelf: "center",
        marginVertical: 5
    }
});

export default styles;