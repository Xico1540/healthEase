import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Location, Practitioner, PractitionerRole } from "fhir/r4";
import * as ExpoLocation from "expo-location";
import LightTheme from "@/src/theme/LightTheme";
import CustomButton from "@/src/components/buttons/CustomButton/CustomButton";
import { IconType } from "@/src/components/icons/CustomIcons";
import ProfessionalCardStyles from "@/src/app/home/components/ProfessionalCard/ProfessionalCardStyles";
import displayFhirHumanName from "@/src/utils/fhirUtils";
import MapboxService, { DirectionsResponse } from "@/src/services/MapBoxService";
import ResourceService from "@/src/services/ResourceService";
import AllowedFhirTypes from "@/src/model/AllowedFhirTypes";
import { AuthContextEnum } from "@/src/model/Authentication";
import GenericUserImage from "@/src/assets/images/generic_user_image.jpg";

interface ProfessionalCardProps {
    practitioner: Practitioner | null;
    practitionerRole: PractitionerRole;
    location?: ExpoLocation.LocationObject | null;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ practitioner, practitionerRole, location }) => {
    const styles = ProfessionalCardStyles();
    const navigation = useNavigation<any>();
    const [practitionerLocation, setPractitionerLocation] = useState<Location | null>(null);
    const [directions, setDirections] = useState<DirectionsResponse | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const mapboxService = MapboxService.getInstance();

    const practitionerName = practitioner?.name ? practitioner.name[0] : undefined;
    const specialty = practitionerRole.specialty?.[0]?.coding?.[0]?.display || "Unknown";

    const practitionerLocationId = practitionerRole.location?.[0]?.reference?.split("/")[1];

    useEffect(() => {
        if (practitionerLocationId) {
            ResourceService.getInstance(AuthContextEnum.CLIENT)
                .getOne(AllowedFhirTypes.Location, practitionerLocationId)
                .then((locationData) => {
                    const parsedLocation = locationData as Location;
                    setPractitionerLocation(parsedLocation);
                })
                .catch((error) => {
                    console.error("Error fetching location: ", error);
                });
        }
    }, [practitionerLocationId]);

    useEffect(() => {
        if (location && practitionerLocation && practitionerLocation.position) {
            const startLocation = { latitude: location.coords.latitude, longitude: location.coords.longitude };
            const endLocation = {
                latitude: practitionerLocation.position.latitude,
                longitude: practitionerLocation.position.longitude,
            };

            mapboxService
                .fetchDirections(startLocation, endLocation)
                .then((data) => {
                    if (data.routes && data.routes.length > 0) {
                        setDirections(data);
                        setDuration(data.routes[0].duration);
                    } else {
                        setDirections(null);
                        setDuration(null);
                    }
                })
                .catch(() => {
                    setDirections(null);
                    setDuration(null);
                });
        } else {
            setDirections(null);
            setDuration(null);
        }
    }, [location, practitionerLocation]);

    return (
        <View style={styles.card}>
            <View style={styles.cardContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>
                        {practitionerName ? displayFhirHumanName(practitionerName) : "Unknown"}
                    </Text>
                    <Text style={styles.specialty}>Especialidade: {specialty}</Text>
                    {location ? (
                        <>
                            <Text style={styles.distance}>
                                {directions && directions.routes && directions.routes.length > 0
                                    ? `Distância: ${(directions.routes[0].distance / 1000).toFixed(2)} km`
                                    : "Distância não disponível"}
                            </Text>
                            <Text style={styles.distance}>
                                {duration
                                    ? `Tempo estimado: ${(duration / 60).toFixed(2)} minutos`
                                    : "Tempo não disponível"}
                            </Text>
                        </>
                    ) : (
                        <Text style={styles.distance}>Localização não disponível</Text>
                    )}
                </View>
                <CustomButton
                    title="Agendar Marcação"
                    onPress={() => {
                        navigation.navigate("practicionerDetails/screens/ProfessionalDetails", {
                            practitioner,
                            practitionerRole,
                        });
                    }}
                    icon={{ type: IconType.featherIcon, name: "calendar" }}
                    buttonStyle={[
                        {
                            backgroundColor: LightTheme.colors.primary,
                            borderRadius: 20,
                            paddingHorizontal: 10,
                        },
                        styles.fixedButton,
                    ]}
                    textStyle={{ color: LightTheme.colors.primary }}
                />
            </View>
            {practitioner?.photo?.[0]?.data ? (
                <Image
                    source={{ uri: `data:image/jpeg;base64,${practitioner.photo[0].data}` }}
                    style={styles.image}
                />
            ) : practitioner?.photo?.[0]?.url ? (
                <Image source={{ uri: practitioner.photo[0].url }} style={styles.image} />
            ) : (
                <Image source={GenericUserImage} style={styles.image} />
            )}
        </View>
    );
};

export default ProfessionalCard;
