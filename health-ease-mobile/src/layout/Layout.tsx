import React, { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { logger } from "react-native-logs";
import { SheetProvider } from "react-native-actions-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { mix } from "polished";
import CommonStyles from "@/src/theme/CommonStyles";
import LoginScreen from "@/src/app/login";
import { useAuth } from "@/src/context/AuthProviderContext";
import LightTheme from "@/src/theme/LightTheme";
import LoadingScreen from "@/src/components/loadingScreen/LoadingScreen";
import RegistrationScreen from "@/src/app/registration/RegistrationScreen";
import { useSafeAreaColorContext } from "@/src/context/SafeAreaColorContext";
import { LoadingProvider } from "@/src/context/LoadingContext";
import TabsNavigator from "@/src/layout/TabsNavigator";
import PractitionerDetails from "@/src/app/practicionerDetails/screens/PractitionerDetails/PractitionerDetails";
import "@/src/app/sheets";
import { SAFE_AREA_LINEAR_BG_DISTRIBUTION } from "@/src/app/login/config/LoginConstants";
import { GetSafeAreaBackground } from "@/src/app/login/styles/LoginStyles";

const Stack = createStackNavigator();
const log = logger.createLogger();

const Layout: React.FC = () => {
    const styles = CommonStyles();
    const [isLoading, setIsLoading] = React.useState(true);
    const { isAuthenticated, checkAuthentication } = useAuth();
    const { backgroundColor } = useSafeAreaColorContext();

    useEffect(() => {
        (async () => {
            try {
                await checkAuthentication();
            } catch (error) {
                log.error("Error during initial check", error);
            } finally {
                setIsLoading(false);
            }
        })();

        return () => {
            setIsLoading(true);
        };
    }, []);

    if (isLoading) {
        return (
            <LoadingScreen size="large" color={LightTheme.colors.white} backgroundColor={LightTheme.colors.primary} />
        );
    }

    return (

        <SafeAreaProvider>
            <SheetProvider context="global">
                <LoadingProvider>
                    <StatusBar
                        barStyle={backgroundColor === LightTheme.colors.white ? "dark-content" : "light-content"}
                        backgroundColor={backgroundColor}
                    />
                    <GestureHandlerRootView style={styles.fullHeight}>
                        <NavigationContainer theme={LightTheme}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                                style={styles.fullHeight}>
                                {isAuthenticated ? (
                                    <LinearGradient
                                        locations={SAFE_AREA_LINEAR_BG_DISTRIBUTION}
                                        colors={[
                                            LightTheme.colors.primary,
                                            mix(0.05, LightTheme.colors.primary, LightTheme.colors.white)
                                        ]}
                                        style={{ flex: 1 }}>
                                        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                                            <Stack.Navigator initialRouteName="TabsNavigator">
                                                <Stack.Screen
                                                    name="TabsNavigator"
                                                    component={TabsNavigator}
                                                    options={{ headerShown: false }}
                                                />
                                                <Stack.Screen
                                                    name="practicionerDetails/screens/ProfessionalDetails"
                                                    component={PractitionerDetails}
                                                    options={{ headerShown: false }}
                                                />
                                            </Stack.Navigator>
                                        </SafeAreaView>
                                    </LinearGradient>
                                ) : (
                                    <LinearGradient
                                        locations={SAFE_AREA_LINEAR_BG_DISTRIBUTION}
                                        colors={GetSafeAreaBackground()}
                                        style={{ flex: 1 }}>
                                        <SafeAreaView style={{ flex: 1 }}>
                                            <Stack.Navigator initialRouteName="login/screens/LoginScreen">
                                                <Stack.Screen
                                                    name="login/screens/LoginScreen"
                                                    component={LoginScreen}
                                                    options={{ headerShown: false }}
                                                />
                                                <Stack.Screen
                                                    name="login/screens/registration/RegistrationScreen"
                                                    component={RegistrationScreen}
                                                    options={{ headerShown: false }}
                                                />
                                            </Stack.Navigator>
                                        </SafeAreaView>
                                    </LinearGradient>
                                )}
                            </KeyboardAvoidingView>
                        </NavigationContainer>
                    </GestureHandlerRootView>
                </LoadingProvider>
            </SheetProvider>

        </SafeAreaProvider>
    );
};

export default Layout;
