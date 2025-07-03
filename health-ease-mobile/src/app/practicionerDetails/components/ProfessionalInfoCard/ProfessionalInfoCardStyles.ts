import { StyleSheet } from "react-native";
import LightTheme from "@/src/theme/LightTheme";

const ProfessionalInfoCardStyles = StyleSheet.create({
    card: {
        display: "flex",
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 22,
        backgroundColor: LightTheme.colors.card,
        width: "100%",
        maxWidth: 4402,
        height: "auto",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 70,
        backgroundColor: LightTheme.colors.background,
    },
    doctorNameContainer: {
        marginLeft: 10,
    },
    doctorName: {
        fontSize: 20,
        fontWeight: "600",
        color: LightTheme.colors.secondary,
    },
    infoContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    specialty: {
        fontSize: 14,
        color: LightTheme.colors.primary,
        lineHeight: 22,
    },
    education: {
        fontSize: 14,
        color: LightTheme.colors.primary,
        lineHeight: 22,
    },
    fixedButton: {
        marginTop: 10,
        borderRadius: 23,
        padding: 7,
        paddingHorizontal: 10,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 200,
    },
    aboutMe: {
        fontSize: 14,
        color: "#333",
        marginVertical: 8,
    },
    container: {
        padding: 10,
        backgroundColor: "#fff",
    },
    badge: {
        backgroundColor: LightTheme.colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: "flex-start",
        marginBottom: 10,
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    jobContainer: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
    },
    role: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    organization: {
        fontSize: 14,
        color: "#555",
        marginBottom: 5,
    },
    dates: {
        fontSize: 12,
        color: "#999",
        marginBottom: 5,
    },
    description: {
        fontSize: 12,
        color: "#333",
    },
    certificationContainer: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
    },
    certificationName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    certificationOrganization: {
        fontSize: 14,
        color: "#555",
        marginBottom: 5,
    },
    certificationDate: {
        fontSize: 12,
        color: "#999",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
});

export default ProfessionalInfoCardStyles;
