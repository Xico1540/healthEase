import React from "react";
import { Pressable, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/core";
import GoogleProvider from "@/src/assets/images/google_provider.svg";
import MicrosoftProvider from "@/src/assets/images/microsoft_provider.svg";
import { CreateLoginStyles } from "@/src/app/login/styles/LoginStyles";

const SocialLogin: React.FC = () => {
    const styles = CreateLoginStyles();
    const navigator = useNavigation<NavigationProp<any>>();
    const iconSize: number = 30;
    const showLoginProviders = false;

    return (
        <View testID="socialLoginView">
            {showLoginProviders && (
                <View>
                    <View testID="textContainerView" style={styles.orTextContainer}>
                        <View style={styles.orTextLine} />
                        <Text style={styles.orText}>Continue com outros métodos</Text>
                        <View style={styles.orTextLine} />
                    </View>
                    <View testID="socialContainerView" style={styles.socialContainer}>
                        <Pressable style={styles.socialButton}>
                            <GoogleProvider testID="googleLogo" width={iconSize} height={iconSize} />
                        </Pressable>
                        <Pressable style={styles.socialButton}>
                            <FontAwesome testID="appleLogo" name="apple" size={iconSize} color="#fff" />
                        </Pressable>
                        <Pressable style={styles.socialButton}>
                            <MicrosoftProvider testID="microsoftLogo" width={iconSize} height={iconSize} />
                        </Pressable>
                    </View>
                </View>
            )}

            <Pressable
                testID="noAccountButton"
                onPress={() => navigator.navigate("login/screens/registration/RegistrationScreen")}>
                <Text testID="registerText" style={styles.registerText}>
                    Não tem uma conta?&nbsp;
                    <Text style={styles.link}>Registe-se aqui.</Text>
                </Text>
            </Pressable>
        </View>
    );
};

export default SocialLogin;
