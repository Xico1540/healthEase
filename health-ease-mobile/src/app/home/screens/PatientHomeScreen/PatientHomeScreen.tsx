import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Appointment, Practitioner, PractitionerRole } from "fhir/r4";
import * as Location from "expo-location";
import Specialities from "@/src/app/home/components/Specialisties/Specialities";
import LocationPermission from "@/src/app/home/components/LocationPermission/LocationPermission";
import ProfessionalCard from "@/src/app/home/components/ProfessionalCard/ProfessionalCard";
import AppointmentCard from "@/src/app/home/components/AppointmentCard/AppointmentCard";
import HomeScreenStyles from "@/src/app/home/screens/HomeScreenStyles";

type PractitionerWithRole = {
    practitioner: Practitioner | null;
    practitionerRole: PractitionerRole;
};

type PatientHomeScreenProps = {
    practitionersData: PractitionerWithRole[];
    appointmentData: Appointment | null;
    setSelectedSpeciality: (speciality: string | null) => void;
    refreshData: () => Promise<void>;
};

const PatientHomeScreen: React.FC<PatientHomeScreenProps> = ({
    practitionersData,
    appointmentData,
    setSelectedSpeciality,
    refreshData,
}) => {
    const styles = HomeScreenStyles();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refreshData().finally(() => setRefreshing(false));
    }, [refreshData]);

    return (
        <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={{ display: "flex", gap: 10 }}>
                <Specialities setSpeciality={setSelectedSpeciality} />
                <LocationPermission setLocation={setLocation} location={location} />
                {practitionersData.length === 0 ? (
                    <View style={styles.noPractitionersTextContainer}>
                        <Text style={styles.noPractitionersText}>Nenhum profissional encontrado</Text>
                    </View>
                ) : (
                    <View style={styles.cardsContainer}>
                        {practitionersData.map(({ practitioner, practitionerRole }) => (
                            <ProfessionalCard
                                key={practitioner?.id}
                                practitioner={practitioner}
                                practitionerRole={practitionerRole}
                                location={location}
                            />
                        ))}
                    </View>
                )}
                {appointmentData && (
                    <AppointmentCard
                        date={appointmentData.start!}
                        doctorReference={
                            appointmentData.participant?.find((participant) =>
                                participant.actor?.reference?.startsWith("Practitioner/"),
                            )?.actor?.reference!
                        }
                        description={appointmentData.description || "Sem descrição"}
                    />
                )}
            </View>
        </ScrollView>
    );
};

export default PatientHomeScreen;
