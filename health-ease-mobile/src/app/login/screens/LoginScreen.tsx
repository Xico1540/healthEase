import React from "react";
import { Keyboard, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import LoginHeader from "@/src/app/login/components/LoginHeader";
import LoginForm from "@/src/app/login/components/LoginForm";
import SocialLogin from "@/src/app/login/components/SocialLogin";
import {
    KEYBOARD_AVOIDING_BEHAVIOR,
    SAFE_AREA_EDGE,
    SAFE_AREA_INITIAL_METRICS,
} from "@/src/app/login/config/LoginConstants";
import { CreateLoginStyles } from "@/src/app/login/styles/LoginStyles";

const LoginScreen: React.FC = () => {
    const styles = CreateLoginStyles();

    return (
        <TouchableWithoutFeedback testID="loginScreenTouchable" onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={KEYBOARD_AVOIDING_BEHAVIOR} style={styles.keyboardAvoidingView}>
                <SafeAreaProvider initialMetrics={SAFE_AREA_INITIAL_METRICS}>
                    <SafeAreaView style={styles.safeAreaContainer} edges={["top"]}>
                        <View testID="loginScreenView" style={styles.container}>
                            <LoginHeader />
                            <View testID="formContainerView" style={[styles.formContainer]}>
                                <ScrollView
                                    contentContainerStyle={styles.scrollViewFormContainer}
                                    keyboardShouldPersistTaps="always">
                                    <LoginForm />
                                    <SocialLogin />
                                </ScrollView>
                            </View>
                        </View>
                    </SafeAreaView>
                </SafeAreaProvider>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default LoginScreen;
