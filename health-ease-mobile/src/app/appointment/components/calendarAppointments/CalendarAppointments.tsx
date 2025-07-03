import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Appointment, BundleEntry } from "fhir/r4";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { logger } from "react-native-logs";
import CalendarAppointmentsStyles
    from "@/src/app/appointment/components/calendarAppointments/CalendarAppointmentsStyles";
import LightTheme from "@/src/theme/LightTheme";
import { useAuth } from "@/src/context/AuthProviderContext";
import AllowedFhirTypes from "@/src/model/AllowedFhirTypes";
import ResourceService from "@/src/services/ResourceService";
import { AuthContextEnum } from "@/src/model/Authentication";

const log = logger.createLogger();

LocaleConfig.locales.pt = {
    monthNames: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ],
    monthNamesShort: ["Jan.", "Fev.", "Mar.", "Abr.", "Mai.", "Jun.", "Jul.", "Ago.", "Set.", "Out.", "Nov.", "Dez."],
    dayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
    dayNamesShort: ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."],
    today: "Hoje"
};
LocaleConfig.defaultLocale = "pt";

interface CalendarAppointmentsProps {
    setSelectedDate: (date: string) => void;
    selectedDate: string;
    isPatient: boolean;
}

const CalendarAppointments: React.FC<CalendarAppointmentsProps> = ({ setSelectedDate, selectedDate, isPatient }) => {
    const styles = CalendarAppointmentsStyles;
    const [markedDates, setMarkedDates] = useState({});
    const { userDetails } = useAuth();
    const ResourceServiceInstanceClient = ResourceService.getInstance(AuthContextEnum.CLIENT);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (userDetails) {
                const appointmentsResponse = await ResourceServiceInstanceClient.getList(AllowedFhirTypes.Appointment, {
                    participant: isPatient ? `Patient/${userDetails.id}` : `Practitioner/${userDetails.id}`
                });

                const appointments: BundleEntry<Appointment>[] =
                    (appointmentsResponse.entry as BundleEntry<Appointment>[]) || [];
                const colors = [LightTheme.colors.primary, LightTheme.colors.warning, LightTheme.colors.success];
                let colorIndex = 0;

                const markedAppointments = appointments.reduce((acc: any, appointment: any) => {
                    const date = appointment.resource.start.split("T")[0];
                    if (!acc[date]) {
                        acc[date] = {
                            dots: [],
                            selected: false,
                            disabled: false
                        };
                    }
                    acc[date].dots.push({ key: `appointment-${appointment.resource.id}`, color: colors[colorIndex] });
                    colorIndex = (colorIndex + 1) % colors.length;
                    return acc;
                }, {});

                setMarkedDates(markedAppointments);
            }
        };

        fetchSchedule()
            .then(() => log.info("Schedule fetched"))
            .catch((e) => log.error("Error fetching schedule", e));
    }, [userDetails]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Calendário de marcações</Text>
            <Calendar
                onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                }}
                markingType="multi-dot"
                markedDates={{
                    ...markedDates,
                    [selectedDate]: { selected: true, selectedColor: LightTheme.colors.primary, marked: true }
                }}
                style={styles.calendar}
                theme={{
                    calendarBackground: LightTheme.colors.card,
                    textSectionTitleColor: LightTheme.colors.primary,
                    selectedDayBackgroundColor: LightTheme.colors.success,
                    selectedDayTextColor: LightTheme.colors.white,
                    todayTextColor: LightTheme.colors.white,
                    todayDotColor: LightTheme.colors.error,
                    todayBackgroundColor: LightTheme.colors.success,
                    dayTextColor: LightTheme.colors.secondary,
                    textDisabledColor: LightTheme.colors.secondaryText,
                    dotColor: LightTheme.colors.warning,
                    selectedDotColor: LightTheme.colors.success,
                    arrowColor: LightTheme.colors.primary,
                    monthTextColor: LightTheme.colors.secondary,
                    textDayFontFamily: "PoppinsRegular",
                    textMonthFontFamily: "PoppinsRegular",
                    textDayHeaderFontFamily: "PoppinsRegular",
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14
                }}
            />
        </View>
    );
};

export default CalendarAppointments;
