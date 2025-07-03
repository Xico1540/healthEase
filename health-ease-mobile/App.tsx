import React from "react";
import { View } from "react-native";
import useFontsAndSplash from "./src/components/useFontsAndSplash";
import { AuthProviderContext } from "@/src/context/AuthProviderContext";
import LoadingScreen from "@/src/components/loadingScreen/LoadingScreen";
import LightTheme from "@/src/theme/LightTheme";
import { CustomAlertProvider } from "@/src/components/customAlert/CustomAlertProvider";
import { SafeAreaColorContext } from "@/src/context/SafeAreaColorContext";
import Layout from "@/src/layout/Layout";

export default function App() {
    const { loaded, error } = useFontsAndSplash();

    if (error) {
        return <View style={{ flex: 1 }} />;
    }

    if (!loaded) {
        return (
            <LoadingScreen size="large" color={LightTheme.colors.white} backgroundColor={LightTheme.colors.primary} />
        );
    }

    return (
        <SafeAreaColorContext>
            <CustomAlertProvider>
                <AuthProviderContext>
                    <Layout />
                </AuthProviderContext>
            </CustomAlertProvider>
        </SafeAreaColorContext>
    );
}
