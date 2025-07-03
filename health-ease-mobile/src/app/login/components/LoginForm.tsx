import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AuthenticationLogin } from "@/src/model/Authentication";
import { CreateLoginStyles } from "@/src/app/login/styles/LoginStyles";
import LoginSchemas from "@/src/validations/yup/loginSchemas";
import { useAuth } from "@/src/context/AuthProviderContext";

const LoginForm: React.FC = () => {
    const styles = CreateLoginStyles();
    const { loginSchema } = LoginSchemas();
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { login } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<AuthenticationLogin>({
        resolver: yupResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: AuthenticationLogin) => {
        setIsSubmitted(true);
        try {
            await login(setLoading, data);
        } catch (error) {
            Alert.alert("Error", "Error logging in");
        }
    };

    return (
        <View testID="loginFormView">
            <Text testID="loginTitle" style={styles.label}>
                Login
            </Text>
            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur } }) => (
                    <TextInput
                        testID="emailTextInput"
                        style={[styles.input, errors.email && isSubmitted ? styles.inputError : null]}
                        placeholder="Email or SNS"
                        placeholderTextColor="#fff"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="email-address"
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                )}
            />
            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur } }) => (
                    <View style={styles.passwordContainer}>
                        <TextInput
                            testID="passwordTextInput"
                            style={[styles.input, errors.password && isSubmitted ? styles.inputError : null]}
                            placeholder="Password"
                            placeholderTextColor="#fff"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            secureTextEntry={secureTextEntry}
                            autoCorrect={false}
                        />
                        <Pressable
                            testID="showPasswordButton"
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                            style={styles.icon}>
                            <FontAwesome
                                testID="eyeIcon"
                                name={secureTextEntry ? "eye" : "eye-slash"}
                                size={20}
                                color="#fff"
                            />
                        </Pressable>
                    </View>
                )}
            />
            <Pressable
                testID="loginButton"
                style={!isValid || loading ? styles.disabledButton : styles.button}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}>
                <Text style={!isValid ? styles.disabledButtonText : styles.buttonText}>Login</Text>
                {loading && (
                    <View>
                        <ActivityIndicator size="small" color="#fff" />
                    </View>
                )}
            </Pressable>

            {isSubmitted && Object.keys(errors).length > 0 ? (
                <View key={Object.keys(errors)[0]} style={styles.errorContainer}>
                    <FontAwesome style={styles.errorIcon} name="exclamation-triangle" size={14.5} />
                    <Text testID="errorText" style={styles.errorText}>
                        {errors[Object.keys(errors)[0] as keyof typeof errors]?.message}
                    </Text>
                </View>
            ) : null}
        </View>
    );
};

export default LoginForm;
