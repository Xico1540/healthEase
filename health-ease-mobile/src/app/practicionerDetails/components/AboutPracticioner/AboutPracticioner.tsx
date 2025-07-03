import React from "react";
import { View, Text } from "react-native";
import { Practitioner } from "fhir/r4";
import AboutPracticionerStyles from "@/src/app/practicionerDetails/components/AboutPracticioner/AboutPracticionerStyles";

interface AboutPracticionerProps {
    practitioner: Practitioner;
}

const AboutPracticioner: React.FC<AboutPracticionerProps> = ({ practitioner }) => {
    const styles = AboutPracticionerStyles;

    const aboutMeExtension = practitioner.extension?.find(
        (ext) => ext.url === "http://example.com/fhir/StructureDefinition/aboutMe",
    );
    const aboutMe = aboutMeExtension
        ? aboutMeExtension.valueString
        : "Informação sobre o profissional não especificada";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sobre o Profissional</Text>
            <Text style={styles.description}>{aboutMe}</Text>
        </View>
    );
};

export default AboutPracticioner;
