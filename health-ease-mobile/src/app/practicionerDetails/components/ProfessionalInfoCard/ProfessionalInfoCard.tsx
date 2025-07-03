import React, { useState } from "react";
import { Image, Modal, Text, View } from "react-native";
import { Practitioner, PractitionerRole } from "fhir/r4";
import CustomButton from "@/src/components/buttons/CustomButton/CustomButton";
import { IconType } from "@/src/components/icons/CustomIcons";
import LightTheme from "@/src/theme/LightTheme";
import ProfessionalInfoCardStyles from "./ProfessionalInfoCardStyles";
import { getEducation, getImageUrl, getPractitionerName, getSpecialty } from "@/src/utils/fhirUtils";
import ProfessionalHistory from "@/src/app/practicionerDetails/components/ProfessionalInfoCard/CertificationAndHistory/ProfessionalHistory";
import Certifications from "@/src/app/practicionerDetails/components/ProfessionalInfoCard/CertificationAndHistory/Certification";

interface ProfessionalInfoCardProps {
    practitioner: Practitioner;
    practitionerRole: PractitionerRole;
}

const ProfessionalInfoCard: React.FC<ProfessionalInfoCardProps> = ({ practitioner, practitionerRole }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const styles = ProfessionalInfoCardStyles;

    const imageUrl = getImageUrl(practitioner);
    const practitionerName = getPractitionerName(practitioner);
    const specialty = getSpecialty(practitionerRole);
    const education = getEducation(practitioner);

    return (
        <View style={styles.card}>
            <View style={styles.headerContainer}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                <View style={styles.doctorNameContainer}>
                    <Text style={styles.doctorName}>{practitionerName}</Text>
                    <Text style={styles.specialty}>{specialty}</Text>
                    <Text style={styles.education}>{education}</Text>
                </View>
            </View>
            <View style={styles.infoContainer}>
                <CustomButton
                    title="Certificações e Histórico"
                    icon={{ type: IconType.featherIcon, name: "calendar" }}
                    outline
                    buttonStyle={[styles.fixedButton]}
                    textColor={LightTheme.colors.primary}
                    onPress={() => setModalVisible(true)}
                />
            </View>
            <Modal
                animationType="slide"
                transparent
                statusBarTranslucent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Certifications practitioner={practitioner} />
                        <ProfessionalHistory practitioner={practitioner} />
                        <CustomButton
                            title="Fechar Informações"
                            onPress={() => setModalVisible(false)}
                            icon={{ type: IconType.featherIcon, name: "x" }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ProfessionalInfoCard;
