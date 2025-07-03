import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { format, parseISO } from "date-fns";
import { Practitioner } from "fhir/r4";
import AppointmentCardStyles from "@/src/app/home/components/AppointmentCard/AppointmentCardStyles";
import ResourceService from "@/src/services/ResourceService";
import { AuthContextEnum } from "@/src/model/Authentication";
import AllowedFhirTypes from "@/src/model/AllowedFhirTypes";
import displayFhirHumanName from "@/src/utils/fhirUtils";

interface AppointmentCardProps {
    date: string;
    doctorReference: string;
    description: string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ date, doctorReference, description }) => {
    const [practitionerData, setPractitionerData] = useState<Practitioner | null>(null);
    const styles = AppointmentCardStyles();

    const formattedDate = format(parseISO(date), "EEEE \n dd/MM");
    const formattedHour = format(parseISO(date), "hh:mm a");

    const fetchAppointmentData = async () => {
        if (doctorReference) {
            const spilitDoctorReference = doctorReference.split("/");
            const appointmentResponse = await ResourceService.getInstance(AuthContextEnum.CLIENT).getOne(
                AllowedFhirTypes.Practitioner,
                spilitDoctorReference[1],
            );

            setPractitionerData(appointmentResponse as Practitioner);
        }
    };

    useEffect(() => {
        fetchAppointmentData();
    }, [doctorReference]);

    return (
        <View style={styles.card}>
            <View style={styles.timeCard}>
                <Text style={styles.date}>{formattedDate}</Text>
            </View>
            <View>
                <Text style={styles.time}>{formattedHour}</Text>
                {practitionerData && (
                    <Text style={styles.doctorName}>{displayFhirHumanName(practitionerData.name![0]!)}</Text>
                )}
                <Text style={styles.issue}>{description}</Text>
            </View>
        </View>
    );
};

export default AppointmentCard;
