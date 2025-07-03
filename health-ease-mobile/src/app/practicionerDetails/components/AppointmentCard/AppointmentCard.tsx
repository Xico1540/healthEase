import React from "react";
import { Alert, View } from "react-native";
import { Title } from "react-native-paper";
import { Appointment, Practitioner, Slot } from "fhir/r4";
import CustomButton from "@/src/components/buttons/CustomButton/CustomButton";
import { IconType } from "@/src/components/icons/CustomIcons";
import AppointmentCardStyles from "@/src/app/practicionerDetails/components/AppointmentCard/AppointmentCardStyles";
import Label from "@/src/components/common/label/Label";
import { formatDateTime } from "@/src/utils/dateUtils";
import ResourceService from "@/src/services/ResourceService";
import AllowedFhirTypes from "@/src/model/AllowedFhirTypes";
import { AuthContextEnum } from "@/src/model/Authentication";
import { useAuth } from "@/src/context/AuthProviderContext";

interface AppointmentCardProps {
    selectedSlot: Slot;
    selectedPractitioner: Practitioner;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ selectedSlot, selectedPractitioner }) => {
    const styles = AppointmentCardStyles;
    const { day, time } = formatDateTime(selectedSlot.start, selectedSlot.end);
    const { userDetails } = useAuth();

    const handleCreateAppointment = async () => {
        const appointment: Appointment = {
            resourceType: "Appointment",
            status: "booked",
            start: selectedSlot.start,
            end: selectedSlot.end,
            slot: [{ reference: `Slot/${selectedSlot.id}` }],
            participant: [
                {
                    actor: { reference: `Patient/${userDetails?.id}` },
                    status: "accepted",
                },
                {
                    actor: { reference: `Practitioner/${selectedPractitioner.id}` },
                    status: "accepted",
                },
            ],
        };

        try {
            const resourceService = ResourceService.getInstance(AuthContextEnum.CLIENT);
            await resourceService.create(AllowedFhirTypes.Appointment, appointment);
            Alert.alert("Sucesso", "Sessão marcada com sucesso!");
        } catch (error) {
            Alert.alert("Erro ao marcar a sessão", error instanceof Error ? error.message : String(error));
        }
    };

    return (
        <View style={styles.cardContainer}>
            <Title>Marcar Sessão</Title>
            <Label title={`Marque uma sessão com o profissional na ${day} das ${time}`} />
            <CustomButton
                title="Efectuar Marcação"
                onPress={() =>
                    Alert.alert(
                        "Confirmação de Marcação",
                        `Deseja marcar uma sessão com o profissional ${day} às ${time}?`,
                        [
                            { text: "Sim", onPress: () => handleCreateAppointment() },
                            {
                                text: "Cancelar",
                                onPress: () => {},
                            },
                        ],
                    )
                }
                icon={{ type: IconType.featherIcon, name: "calendar" }}
            />
        </View>
    );
};

export default AppointmentCard;
