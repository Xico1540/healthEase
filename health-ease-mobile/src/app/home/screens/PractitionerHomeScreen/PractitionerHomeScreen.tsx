import React, { useCallback, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { differenceInMinutes, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment, AppointmentParticipant, HumanName, Patient, Practitioner, PractitionerRole } from "fhir/r4";
import { SheetManager } from "react-native-actions-sheet";
import { logger } from "react-native-logs";
import { useFocusEffect } from "@react-navigation/core";
import LightTheme from "@/src/theme/LightTheme";
import CustomButton from "@/src/components/buttons/CustomButton/CustomButton";
import AllowedFhirTypes from "@/src/model/AllowedFhirTypes";
import ResourceService from "@/src/services/ResourceService";
import { AuthContextEnum } from "@/src/model/Authentication";
import displayFhirHumanName from "@/src/utils/fhirUtils";
import GenericUserImage from "@/src/assets/images/generic_user_image.jpg";
import PractitionerHomeScreenStyles from "@/src/app/home/screens/PractitionerHomeScreen/PractitionerHomeScreenStyles";

type TabType = "todas" | "próximas" | "concluídas";

const colorMapping: Record<TabType, string> = {
    todas: LightTheme.colors.success,
    próximas: LightTheme.colors.warning,
    concluídas: LightTheme.colors.error
};

type PractitionerHomeScreenProps = {
    userDetails: Patient | Practitioner | undefined;
};

export type EnrichedAppointment = {
    appointment: Appointment;
    patientDetails: Patient | null;
    practitionerRoleSpecialty: string | undefined;
}

const log = logger.createLogger();

const PractitionerHomeScreen = ({ userDetails }: PractitionerHomeScreenProps) => {
    const styles = PractitionerHomeScreenStyles();
    const ResourceServiceInstance = ResourceService.getInstance(AuthContextEnum.CLIENT);
    const [activeTab, setActiveTab] = useState("todas");
    const [enrichedAppointment, setEnrichedAppointment] = useState<EnrichedAppointment[] | null>(null);

    const fetchAppointments = async () => {
        try {
            const appointmentResponse = await ResourceServiceInstance.getList(AllowedFhirTypes.Appointment, {
                participant: `Practitioner/${userDetails?.id}`
            });
            const data = appointmentResponse.entry || [];
            const enrichedAppointments = await Promise.all(
                data.map(async (item: any) => {
                    const { resource } = item;
                    const patient = resource.participant.find((p: AppointmentParticipant) =>
                        p.actor?.reference?.startsWith("Patient")
                    );
                    let patientDetails: Patient | null = null;
                    let practitionerRoleSpecialty: string | undefined;
                    if (patient) {
                        const patientId = patient.actor.reference.split("/")[1];
                        patientDetails = (await ResourceServiceInstance.getOne(
                            AllowedFhirTypes.Patient,
                            patientId
                        )) as Patient;
                    }
                    if (userDetails?.id) {
                        const practitionerRoleDetails = (await ResourceServiceInstance.getList(AllowedFhirTypes.PractitionerRole, {
                            practitioner: `Practitioner/${userDetails?.id}`
                        })).entry?.[0]?.resource as PractitionerRole;
                        practitionerRoleSpecialty = practitionerRoleDetails?.specialty?.[0]?.coding?.[0]?.display;
                    }
                    return {
                        appointment: resource,
                        patientDetails,
                        practitionerRoleSpecialty
                    };
                })
            );
            setEnrichedAppointment(enrichedAppointments);
        } catch (error) {
            log.error("Error fetching appointment data:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                await fetchAppointments();
            };
            (async () => {
                await fetchData();
            })();
        }, [userDetails])
    );

    const filterAppointments = () => {
        if (activeTab === "todas") {
            return enrichedAppointment;
        }
        if (activeTab === "próximas") {
            return enrichedAppointment?.filter((_enrichedAppointment: EnrichedAppointment) => {
                const { start } = _enrichedAppointment.appointment;
                return new Date(start!) > new Date();
            });
        }
        if (activeTab === "concluídas") {
            return enrichedAppointment?.filter((_enrichedAppointment: EnrichedAppointment) => {
                const { start } = _enrichedAppointment.appointment;
                return new Date(start!) < new Date();
            });
        }
        return [];
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
                {["todas", "próximas", "concluídas"].map((tab) => (
                    <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                        <Text
                            style={[
                                styles.tab,
                                { color: activeTab === tab ? colorMapping[tab as TabType] : "#A0A0A0" },
                                activeTab === tab && {
                                    borderBottomColor: colorMapping[tab as TabType],
                                    borderBottomWidth: 2
                                }
                            ]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <ScrollView style={styles.list}>
                {filterAppointments()?.map((resource: EnrichedAppointment) => {
                    const start = parseISO(resource.appointment.start!);
                    const end = parseISO(resource.appointment.end!);
                    const formattedDate = format(start, "dd 'de' MMMM", { locale: ptBR });
                    const formattedTime = `${formattedDate} das ${format(start, "HH:mm")} às ${format(end, "HH:mm")}`;
                    const duration = Math.abs(differenceInMinutes(end, start));
                    const patientDetails = resource.patientDetails as Patient;
                    const { practitionerRoleSpecialty } = resource;
                    const patientName = displayFhirHumanName(patientDetails?.name?.[0] as HumanName);
                    return (
                        <View style={styles.card} key={resource.appointment.id}>
                            <View style={styles.leftSection}>
                                <Text style={styles.name}>{patientName || "Paciente não identificado"}</Text>
                                <Text style={styles.specialty}>
                                    Especialidade: <Text
                                    style={{ fontWeight: "bold" }}>{practitionerRoleSpecialty}</Text>
                                </Text>
                                <Text style={styles.specialty}>
                                    <Text style={{ fontWeight: "bold" }}>{formattedTime}</Text>
                                </Text>
                                <CustomButton
                                    title="Consultar marcação"
                                    buttonStyle={styles.button}
                                    onPress={() => {
                                        SheetManager.show("appointment-details", { payload: { enrichedAppointment: resource } });
                                    }}
                                />
                            </View>
                            <View style={styles.rightSection}>
                                <Text style={styles.duration}>{`${duration}m`}</Text>
                                {patientDetails?.photo?.[0]?.data ? (
                                    <Image
                                        source={{ uri: `data:image/jpeg;base64,${patientDetails.photo[0].data}` }}
                                        style={styles.image}
                                    />
                                ) : patientDetails?.photo?.[0]?.url ? (
                                    <Image source={{ uri: patientDetails.photo[0].url }} style={styles.image} />
                                ) : (
                                    <Image source={GenericUserImage} style={styles.image} />
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default PractitionerHomeScreen;
