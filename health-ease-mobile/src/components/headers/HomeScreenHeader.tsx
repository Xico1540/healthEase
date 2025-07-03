import React, { useEffect } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Patient } from "fhir/r4";
import GenericUserImage from "@/src/assets/images/generic_user_image.jpg";
import Logo from "@/src/assets/images/logo-white.svg";
import HomeScreenStyles from "@/src/components/headers/HomeScreenHeaderStyles";
import { useAuth } from "@/src/context/AuthProviderContext";

const HomeScreenHeader: React.FC = () => {
    const styles = HomeScreenStyles();
    const navigation = useNavigation<any>();
    const [profilePhoto, setProfilePhoto] = React.useState<any>(GenericUserImage);
    const { userDetails } = useAuth();

    const userDetailsParsed: Patient = userDetails as Patient;

    useEffect(() => {
        if (userDetails && userDetailsParsed) {
            const photo = userDetailsParsed.photo?.[0];
            if (photo?.data) {
                setProfilePhoto(`data:${photo.contentType};base64,${photo.data}`);
            } else if (photo?.url) {
                setProfilePhoto({ uri: photo.url });
            } else {
                setProfilePhoto(GenericUserImage);
            }
        }
    }, [userDetails]);

    return (
        <View style={styles.headerContainer}>
            <Logo style={styles.logo} />
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
                    <Image
                        source={typeof profilePhoto === "string" ? { uri: profilePhoto } : profilePhoto}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeScreenHeader;
