import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { parseToRgb, rgba } from "polished";
import { Appointment, Bundle, BundleEntry, HumanName, Patient, Practitioner, PractitionerRole } from "fhir/r4";
import { differenceInMinutes, parseISO } from "date-fns";
import { logger } from "react-native-logs";
import { isNil } from "lodash";
import { IconType } from "@/src/components/icons/CustomIcons";
import LightTheme from "@/src/theme/LightTheme";
import RoundedButton from "@/src/components/buttons/RoundedButton/RoundedButton";
import ResourceService from "@/src/services/ResourceService";
import { AuthContextEnum } from "@/src/model/Authentication";
import AllowedFhirTypes from "@/src/model/AllowedFhirTypes";
import { formatDateForAppointmentCard, formatHourForAppointmentCard } from "@/src/utils/dateUtils";
import { getPatientName, getPractitionerName } from "@/src/utils/fhirUtils";
import { useAuth } from "@/src/context/AuthProviderContext";
import AppointmentListStyles from "@/src/app/appointment/components/appointmentsList/AppointmentListStyles";

const log = logger.createLogger();

interface ConsultationsProps {
    selectedDate: string;
    isPatient: boolean;
}

interface AppointmentWithPractitioner {
    appointment: Appointment;
    practitioner: Practitioner | null;
    practitionerRole: PractitionerRole | null;
    patient: Patient | null;
}

const AppointmentList: React.FC<ConsultationsProps> = ({ selectedDate, isPatient }) => {
    const styles = AppointmentListStyles;
    const [appointmentsWithPractitioners, setAppointmentsWithPractitioners] = React.useState<
        AppointmentWithPractitioner[]
    >([]);
    const { userDetails } = useAuth();

    const getDoctorPrefix = (names: HumanName[]): string => {
        if (!names || names.length === 0) return "Dr.";
        const firstName = names[0].given?.[0] || "";
        return firstName.endsWith("a") ? "Dra." : "Dr.";
    };

    const formatAppointmentDuration = (start: string, end: string): string => {
        if (!start || !end) return "Duração desconhecida";

        const startDate = parseISO(start);
        const endDate = parseISO(end);

        const durationMinutes = differenceInMinutes(endDate, startDate);

        return `${durationMinutes}m`;
    };

    const getPractitionerDetails = (_isPatient: boolean, practitioner: Practitioner | null, patient: Patient | null) => {
        if (_isPatient) {
            return `${getDoctorPrefix(practitioner?.name || [])} ${practitioner ? getPractitionerName(practitioner) : "de nome desconhecido"}`;
        }

        return patient ? getPatientName(patient) : "Nome do paciente desconhecido";
    };

    const fetchConsultations = async () => {
        const resourceService = ResourceService.getInstance(AuthContextEnum.CLIENT);

        const response = await resourceService.getList(AllowedFhirTypes.Appointment, {
            participant: isPatient ? `Patient/${userDetails?.id}` : `Practitioner/${userDetails?.id}`,
            start: selectedDate
        });
        const entries: BundleEntry<Appointment>[] = (response.entry as BundleEntry<Appointment>[]) || [];
        const combinedData: AppointmentWithPractitioner[] = await Promise.all(
            entries.map(async (entry) => {
                const appointment = entry.resource as Appointment;

                let patient: Patient | null = null;
                let practitioner: Practitioner | null = null;
                let practitionerRole: PractitionerRole | null = null;

                const practitionerParticipant = appointment.participant.find((p) =>
                    p.actor?.reference?.startsWith("Practitioner/")
                );
                const reference = practitionerParticipant?.actor?.reference || undefined;

                if (!isNil(reference)) {
                    const id = reference.split("/")[1];
                    const fetchedPractitioner = (await resourceService.getOne(
                        AllowedFhirTypes.Practitioner,
                        id
                    )) as Practitioner;

                    const patientParticipant = appointment.participant.find((p) =>
                        p.actor?.reference?.startsWith("Patient/")
                    );
                    const patientReference = patientParticipant?.actor?.reference || undefined;

                    if (!isNil(patientReference)) {
                        const patientId = patientReference.split("/")[1];
                        patient = (await resourceService.getOne(
                            AllowedFhirTypes.Patient,
                            patientId
                        )) as Patient;
                    }

                    if (fetchedPractitioner) {
                        practitioner = fetchedPractitioner;

                        const roleResponse: Bundle = await resourceService.getList(AllowedFhirTypes.PractitionerRole, {
                            practitioner: `Practitioner/${id}`
                        });
                        practitionerRole = (roleResponse?.entry?.[0]?.resource as PractitionerRole) || null;
                    }
                }

                return { appointment, practitioner, practitionerRole, patient };
            })
        );

        setAppointmentsWithPractitioners(combinedData);
    };

    useEffect(() => {
        fetchConsultations().catch((error) => {
            log.error("Error fetching consultations", error);
        });
    }, [selectedDate]);

    return (
        <View style={styles.card}>
            <Text style={styles.header}>Consultas marcadas:</Text>
            <View style={styles.consultationsContainer}>
                {appointmentsWithPractitioners.length === 0 ? (
                    <View style={styles.noAppointmentsTextContainer}>
                        <Text style={styles.noAppointmentsText}>
                            Não há consultas marcadas para {formatDateForAppointmentCard(selectedDate)}.
                        </Text>
                    </View>
                ) : (
                    appointmentsWithPractitioners.map((item) => {
                        const { appointment, practitioner, practitionerRole, patient } = item;
                        return (
                            <View key={appointment.id} style={styles.consultationItem}>
                                <View style={styles.dateTimeColumn}>
                                    <View style={styles.dateTimeRow}>
                                        <Text style={styles.date}>
                                            {formatDateForAppointmentCard(appointment.start!)}
                                        </Text>
                                        <RoundedButton
                                            onPress={() => {
                                            }}
                                            size="medium"
                                            variant="muted"
                                            iconName="calendar"
                                            iconSize={20}
                                            iconColor={LightTheme.colors.primary}
                                            iconType={IconType.featherIcon}
                                            style={{
                                                alignSelf: "flex-start",
                                                backgroundColor: rgba({
                                                    ...parseToRgb(LightTheme.colors.black),
                                                    alpha: 0.05
                                                })
                                            }}
                                        />
                                    </View>
                                    <Text style={styles.time}>{formatHourForAppointmentCard(appointment.start!)}</Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: rgba({
                                            ...parseToRgb(LightTheme.colors.black),
                                            alpha: 0.08
                                        }),
                                        borderBottomWidth: 1,
                                        marginVertical: 10
                                    }}
                                />
                                <View style={styles.detailsContainer}>
                                    <View style={styles.detailsRow1}>
                                        <Text style={styles.doctor}>
                                            {isPatient ? "Consulta de " : "Consulta com: "}
                                            {isPatient && (practitionerRole
                                                ? practitionerRole.specialty?.[0]?.text
                                                : "área desconhecida")}
                                        </Text>
                                        <Text style={styles.description}>
                                            {getPractitionerDetails(isPatient, practitioner, patient)}
                                        </Text>
                                    </View>
                                    <View style={styles.detailsRow2}>
                                        <Text style={styles.duration}>
                                            {formatAppointmentDuration(appointment.start!, appointment.end!)}
                                        </Text>
                                        <RoundedButton
                                            onPress={() => {
                                            }}
                                            size="medium"
                                            variant="muted"
                                            iconName="more-vertical"
                                            iconSize={25}
                                            iconColor={LightTheme.colors.primary}
                                            iconType={IconType.featherIcon}
                                            style={{
                                                alignSelf: "flex-start",
                                                backgroundColor: rgba({
                                                    ...parseToRgb(LightTheme.colors.black),
                                                    alpha: 0.05
                                                })
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        );
                    })
                )}
            </View>
        </View>
    );
};

export default AppointmentList;
