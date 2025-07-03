import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { logger } from "react-native-logs";

const log = logger.createLogger();

SplashScreen.preventAutoHideAsync().then((r) => log.info("SplashScreen.preventAutoHideAsync", JSON.stringify(r)));

interface UseFontsAndSplashReturn {
    loaded: boolean;
    error: Error | null;
}

const useFontsAndSplash = (): UseFontsAndSplashReturn => {
    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        PoppinsRegular: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
        PoppinsSemiBold: require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
        PoppinsItalic: require("../assets/fonts/Poppins/Poppins-Italic.ttf"),
        PoppinsBoldItalic: require("../assets/fonts/Poppins/Poppins-BoldItalic.ttf"),
        PoppinsMedium: require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
        PoppinsThin: require("../assets/fonts/Poppins/Poppins-Thin.ttf"),
        PoppinsExtraLight: require("../assets/fonts/Poppins/Poppins-ExtraLight.ttf"),
        ...FontAwesome.font,
    });

    useEffect(() => {
        if (error) {
            log.error("Error loading fonts", error);
        }
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync().then((r) => log.info("SplashScreen.hidesAsync:", JSON.stringify(r)));
        }
    }, [loaded]);

    return { loaded, error };
};

export default useFontsAndSplash;
