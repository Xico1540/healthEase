import React from "react";
import { Text, View } from "react-native";
import { Practitioner } from "fhir/r4";
import ProfessionalInfoCardStyles from "@/src/app/practicionerDetails/components/ProfessionalInfoCard/ProfessionalInfoCardStyles";
import { extractProfessionalHistory } from "@/src/utils/fhirUtils";
import { Job } from "@/src/model/Job";

interface ProfessionalHistoryProps {
    practitioner: Practitioner;
}

const ProfessionalHistory: React.FC<ProfessionalHistoryProps> = ({ practitioner }) => {
    const styles = ProfessionalInfoCardStyles;
    const professionalHistory: Job[] = extractProfessionalHistory(practitioner);

    return (
        <View style={styles.container}>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>Histórico Profissional</Text>
            </View>
            {professionalHistory.map((job) => (
                <View key={`${job.role}-${job.startDate}`} style={styles.jobContainer}>
                    <Text style={styles.role}>{job.role}</Text>
                    <Text style={styles.dates}>
                        {job.startDate} - {job.endDate || "Present"}
                    </Text>
                    <Text style={styles.description}>{job.description}</Text>
                </View>
            ))}
        </View>
    );
};

export default ProfessionalHistory;
