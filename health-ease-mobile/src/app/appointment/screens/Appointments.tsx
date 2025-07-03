import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import RouteHeader from "@/src/components/headers/routeHeader/RouteHeader";
import AppointmentListStyles from "@/src/app/appointment/components/appointmentsList/AppointmentListStyles";
import CalendarAppointments from "@/src/app/appointment/components/calendarAppointments/CalendarAppointments";
import AppointmentList from "@/src/app/appointment/components/appointmentsList/AppointmentList";
import { useAuth } from "@/src/context/AuthProviderContext";

const Appointments: React.FC = () => {
    const styles = AppointmentListStyles;
    const { goBack } = useNavigation();
    const { isPatient } = useAuth();
    const [selectedDate, setSelectedDate] = React.useState<string>(new Date().toISOString().split("T")[0]);
    return (
        <View style={styles.container}>
            <RouteHeader title="Consultas" goBack onGoBack={goBack} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <CalendarAppointments setSelectedDate={setSelectedDate} selectedDate={selectedDate} isPatient={isPatient!} />
                <AppointmentList selectedDate={selectedDate} isPatient={isPatient!}/>
            </ScrollView>
        </View>
    );
};

export default Appointments;
