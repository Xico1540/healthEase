import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { useFocusEffect } from "@react-navigation/core";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Practitioner, PractitionerRole, Slot } from "fhir/r4";
import ProfessionalInfoCard from "@/src/app/practicionerDetails/components/ProfessionalInfoCard/ProfessionalInfoCard";
import PractitionerDetailsStyles from "./PractitionerDetailsStyles";
import AvailabilityCard from "@/src/app/practicionerDetails/components/AvailabilityCard/AvailabilityCard";
import AboutPracticioner from "@/src/app/practicionerDetails/components/AboutPracticioner/AboutPracticioner";
import AppointmentCard from "@/src/app/practicionerDetails/components/AppointmentCard/AppointmentCard";
import LightTheme from "@/src/theme/LightTheme";
import { useSafeAreaColorContext } from "@/src/context/SafeAreaColorContext";
import RouteHeader from "@/src/components/headers/routeHeader/RouteHeader";

type PractitionerDetailsRouteProp = RouteProp<
    {
        params: { practitioner: Practitioner; practitionerRole: PractitionerRole };
    },
    "params"
>;

const PractitionerDetails: React.FC = () => {
    const styles = PractitionerDetailsStyles;
    const { setBackgroundColor } = useSafeAreaColorContext();
    const { goBack } = useNavigation();
    const route = useRoute<PractitionerDetailsRouteProp>();
    const { practitioner, practitionerRole } = route.params;
    const [selectedSlot, setSelectedSlot] = React.useState<Slot | null>(null);

    useFocusEffect(
        useCallback(() => {
            setBackgroundColor(LightTheme.colors.primary);
            return () => {
                setBackgroundColor(LightTheme.colors.white);
            };
        }, []),
    );

    return (
        <View style={{ flex: 1 }}>
            <RouteHeader title="Detalhes do Profissional" goBack onGoBack={goBack} />
            <ScrollView contentContainerStyle={[styles.container, { paddingBottom: selectedSlot ? 165 : 0 }]}>
                <ProfessionalInfoCard practitioner={practitioner} practitionerRole={practitionerRole} />
                <AboutPracticioner practitioner={practitioner} />
                <AvailabilityCard practitioner={practitioner} setSelectedSlot={setSelectedSlot} />
            </ScrollView>
            {selectedSlot && <AppointmentCard selectedSlot={selectedSlot} selectedPractitioner={practitioner} />}
        </View>
    );
};

export default PractitionerDetails;
