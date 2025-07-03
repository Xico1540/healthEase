import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LightTheme from "@/src/theme/LightTheme";
import { IconType } from "@/src/components/icons/CustomIcons";
import CustomButton from "@/src/components/buttons/CustomButton/CustomButton";
import LocationPermissionStyles from "@/src/app/home/components/LocationPermission/LocationPermissionStyles";

interface LocationPermissionProps {
    setLocation: (location: Location.LocationObject) => void;
    location: Location.LocationObject | null;
}

const LocationPermission: React.FC<LocationPermissionProps> = ({ setLocation }) => {
    const [isPermissionDenied, setIsPermissionDenied] = useState(false);
    const styles = LocationPermissionStyles();

    useEffect(() => {
        const checkPermissionStatus = async () => {
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status === "granted") {
                const currentLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Highest,
                });
                setLocation(currentLocation);
            }
        };
        checkPermissionStatus();
    }, []);

    useEffect(() => {
        const checkPermissionStatus = async () => {
            const status = await AsyncStorage.getItem("locationPermissionDenied");
            if (status === "true") {
                setIsPermissionDenied(true);
            }
        };
        checkPermissionStatus();
    }, []);

    const savePermissionStatus = async (status: boolean) => {
        await AsyncStorage.setItem("locationPermissionDenied", status.toString());
    };

    const handleActivateLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permissão negada", "Permissão de localização foi negada.");
            setIsPermissionDenied(true);
            savePermissionStatus(true);
            return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
        });
        setLocation(currentLocation);
        setIsPermissionDenied(true);
        savePermissionStatus(true);
    };

    if (isPermissionDenied) {
        return null;
    }

    return (
        <View style={styles.permissionContainer}>
            <Text style={{ color: LightTheme.colors.text }}>
                Ativar os serviços de localização para encontrar profissionais de saúde próximos.
            </Text>
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Cancelar"
                    onPress={() => {
                        setIsPermissionDenied(true);
                        savePermissionStatus(true);
                    }}
                    icon={{ type: IconType.featherIcon, name: "x" }}
                    outline
                    buttonStyle={styles.customButtonStyle}
                    textStyle={styles.customTextStyle}
                    textColor={LightTheme.colors.primary}
                />
                <CustomButton
                    title="Ativar"
                    onPress={handleActivateLocation}
                    icon={{ type: IconType.featherIcon, name: "check" }}
                    buttonStyle={styles.customButtonStyle}
                    textStyle={styles.customTextStyle}
                />
            </View>
        </View>
    );
};

export default LocationPermission;
