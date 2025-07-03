import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import ActionSheet, { ScrollView, SheetManager, SheetProps, useScrollHandlers } from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import { format } from "date-fns";
import LightTheme from "@/src/theme/LightTheme";
import CustomTitle from "@/src/components/customTitle/CustomTitle";
import CustomButton from "@/src/components/buttons/CustomButton/CustomButton";
import AppointmentDetailsSheetStyles from "@/src/app/home/components/AppointmentDetails/AppointmentDetailsSheetStyles";
import { EnrichedAppointment } from "@/src/app/home/screens/PractitionerHomeScreen/PractitionerHomeScreen";
import { getPatientName, mapGender } from "@/src/utils/fhirUtils";
import { formatDateForAppointmentCard, formatDateTime } from "@/src/utils/dateUtils";
import MapboxService from "@/src/services/MapBoxService";
import GenericUserImage from "@/src/assets/images/generic_user_image.jpg";

export default function AppointmentDetailsSheet({ payload }: SheetProps<"appointment-details">): JSX.Element {
    const [enrichedAppointment, setEnrichedAppointment] = React.useState<EnrichedAppointment>();
    const handlers = useScrollHandlers();
    const mapboxService = MapboxService.getInstance();
    const [coordinates, setCoordinates] = React.useState<{ latitude: number; longitude: number } | null>(null);

    const styles = AppointmentDetailsSheetStyles;

    useEffect(() => {
        setEnrichedAppointment(payload!.enrichedAppointment);
    }, []);

    useEffect(() => {
        if (enrichedAppointment?.patientDetails?.address) {
            const address = enrichedAppointment.patientDetails.address[0];
            const fullAddress = `${address.line?.join(", ") || ""}, ${address.city || ""}, ${address.state || ""}, ${address.postalCode || ""}, ${address.country || ""}`;
            mapboxService
                .fetchCoordinates(fullAddress)
                .then((coordinates) => {
                    setCoordinates({ latitude: coordinates[1], longitude: coordinates[0] });
                })
                .catch((error) => {
                    console.error("Error fetching coordinates: ", error);
                });
        }
    }, [enrichedAppointment?.patientDetails?.address]);

    return (
        <ActionSheet
            id="appointment-details"
            snapPoints={[100]}
            gestureEnabled
            containerStyle={styles.actionSheetContainer}>
            <NativeViewGestureHandler simultaneousHandlers={handlers.simultaneousHandlers}>
                <View>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.header}>
                            <View
                                style={{ width: "100%" }}
                            >
                                <CustomTitle
                                    title="Consultar marcação"
                                    alignSelf="flex-start"
                                    textSize={20}
                                    textColor={LightTheme.colors.secondary}
                                    style={{ marginBottom: 10 }}
                                />
                                <View style={styles.headerDetails}>
                                    {enrichedAppointment?.patientDetails?.photo?.[0]?.data ? (
                                        <Image
                                            source={{ uri: `data:image/jpeg;base64,${enrichedAppointment?.patientDetails?.photo[0].data}` }}
                                            style={styles.profileImage}
                                        />
                                    ) : enrichedAppointment?.patientDetails?.photo?.[0]?.url ? (
                                        <Image source={{ uri: enrichedAppointment?.patientDetails?.photo[0].url }}
                                               style={styles.profileImage} />
                                    ) : (
                                        <Image source={GenericUserImage} style={styles.profileImage} />
                                    )}
                                    <View style={styles.headerInfo}>
                                        <Text style={styles.name}>
                                            {enrichedAppointment?.patientDetails ? (
                                                <Text style={styles.name}>
                                                    {getPatientName(enrichedAppointment.patientDetails)}
                                                </Text>
                                            ) : "Nome do Paciente não especificado"}
                                        </Text>
                                        <View style={styles.InfoCard}>
                                            <View style={styles.infoGroup}>
                                                <Text style={[styles.info, { color: LightTheme.colors.black }]}>
                                                    Data de nascimento:
                                                </Text>
                                                <Text style={styles.highlightedInfo}>
                                                    {enrichedAppointment?.patientDetails?.birthDate
                                                        ? format(new Date(enrichedAppointment.patientDetails.birthDate), "dd/MM/yyyy")
                                                        : "Data de nascimento não especificada"}
                                                </Text>
                                            </View>
                                            <View style={styles.infoGroup}>
                                                <Text
                                                    style={[styles.info, { color: LightTheme.colors.black }]}>Sexo:</Text>
                                                <Text style={styles.highlightedInfo}>
                                                    {mapGender(enrichedAppointment?.patientDetails?.gender)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <CustomTitle
                                alignSelf="flex-start"
                                textSize={15}
                                textColor={LightTheme.colors.secondary}
                                title="Detalhes da Marcação"
                                style={{ marginBottom: 0 }}
                            />
                            <View style={styles.InfoCard}>
                                <View style={styles.infoGroup}>
                                    <Text
                                        style={[styles.info, { color: LightTheme.colors.black }]}>Especialidade:</Text>
                                    <Text style={styles.highlightedInfo}>
                                        {enrichedAppointment?.practitionerRoleSpecialty || "Especialidade não especificada"}
                                    </Text>
                                </View>
                                <View style={styles.infoGroup}>
                                    <Text style={[styles.info, { color: LightTheme.colors.black }]}>Dia da
                                        marcação:</Text>
                                    <Text style={styles.highlightedInfo}>
                                        {enrichedAppointment?.appointment?.start
                                            ? formatDateForAppointmentCard(enrichedAppointment.appointment.start)
                                            : "Data da marcação não especificada"}
                                    </Text>
                                </View>
                                <View style={styles.infoGroup}>
                                    <Text style={[styles.info, { color: LightTheme.colors.black }]}>Hora da
                                        marcação:</Text>
                                    <Text style={styles.highlightedInfo}>
                                        {enrichedAppointment?.appointment?.start && enrichedAppointment?.appointment?.end
                                            ? formatDateTime(enrichedAppointment.appointment.start, enrichedAppointment.appointment.end).time
                                            : "Hora da marcação não especificada"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <CustomTitle
                                alignSelf="flex-start"
                                textSize={15}
                                textColor={LightTheme.colors.secondary}
                                title="Observações"
                                style={{ marginBottom: 0 }}
                            />
                            <Text style={styles.detail}>
                                {enrichedAppointment?.appointment?.comment || "Sem observações"}
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <CustomTitle
                                alignSelf="flex-start"
                                textSize={15}
                                textColor={LightTheme.colors.secondary}
                                title="Morada do Utente"
                                style={{ marginBottom: 0 }}
                            />
                            <Text style={styles.detail}>
                                {enrichedAppointment?.patientDetails?.address?.map((address) => (
                                    <Text key={address.postalCode || Math.random().toString()}
                                          style={styles.detail}>
                                        {address.line?.join(", ") || ""}
                                        {address.city && `, ${address.city}`}
                                        {address.state && `, ${address.state}`}
                                        {address.postalCode && `, ${address.postalCode}`}
                                        {address.country && `, ${address.country}`}
                                    </Text>
                                )) || "Morada não especificada"}
                            </Text>
                            <View style={styles.mapContainer}>
                                {coordinates?.latitude ? (
                                    <MapView
                                        style={styles.map}
                                        initialRegion={{
                                            latitude: coordinates.latitude,
                                            longitude: coordinates.longitude,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01
                                        }}
                                        zoomControlEnabled
                                    >
                                        <Marker
                                            coordinate={{
                                                latitude: coordinates.latitude,
                                                longitude: coordinates.longitude
                                            }}
                                        />
                                    </MapView>
                                ) : (
                                    <Text style={styles.detail}>Mapa não disponível</Text>
                                )
                                }
                            </View>
                        </View>

                        <CustomButton onPress={() => {
                            SheetManager.hide("appointment-details");
                        }} title="Confirmar" buttonStyle={styles.buttonContainer} />
                    </ScrollView>
                </View>
            </NativeViewGestureHandler>
        </ActionSheet>
    );
};