import React from "react";
import { Text, View } from "react-native";
import { Practitioner } from "fhir/r4";
import ProfessionalInfoCardStyles from "@/src/app/practicionerDetails/components/ProfessionalInfoCard/ProfessionalInfoCardStyles";
import { Certification } from "@/src/model/Certification";
import { extractCertifications } from "@/src/utils/fhirUtils";

interface CertificationsProps {
    practitioner: Practitioner;
}

const Certifications: React.FC<CertificationsProps> = ({ practitioner }) => {
    const styles = ProfessionalInfoCardStyles;

    const certifications: Certification[] = extractCertifications(practitioner);

    return (
        <View style={styles.container}>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>Certificação</Text>
            </View>
            {certifications.map((cert) => (
                <View key={`${cert.name}-${cert.issueDate}`} style={styles.certificationContainer}>
                    <Text style={styles.certificationName}>{cert.name}</Text>
                    <Text style={styles.certificationOrganization}>{cert.issuingOrganization}</Text>
                    <Text style={styles.certificationDate}>{cert.issueDate}</Text>
                </View>
            ))}
        </View>
    );
};

export default Certifications;
