import { StyleSheet } from "react-native";

export const ContactPreferencesStyle = () =>
    StyleSheet.create({
        personalInfo: {
            display: "flex",
            flexDirection: "column",
            gap: 15,
            marginBottom: 8,
        },
    });

export default ContactPreferencesStyle;
