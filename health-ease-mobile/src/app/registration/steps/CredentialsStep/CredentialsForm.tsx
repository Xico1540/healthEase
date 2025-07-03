import React, { forwardRef, useCallback, useImperativeHandle } from "react";
import { View } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/core";
import { Credentials, UserRegistration } from "@/src/model/UserRegistration";
import RegistrationSchemas from "@/src/validations/yup/registrationSchemas";
import { IconType } from "@/src/components/icons/CustomIcons";
import CustomTextInput from "@/src/components/inputs/textInputs/CustomTextInput";
import CustomTitle from "@/src/components/customTitle/CustomTitle";
import AddressStyles from "@/src/app/registration/steps/AddressStep/AddressStyles";

interface CredentialsFormProps {
    userRegistration: UserRegistration;
    onSubmit: (data: Credentials) => void;
    onInvalid?: (invalidSubmit: FieldErrors<UserRegistration>) => void;
    isTitleVisible?: boolean;
}

const getDefaultValues = (userRegistration: UserRegistration) =>
    userRegistration.password || {
        password: undefined,
        confirmPassword: undefined,
    };

const CredentialsForm = forwardRef(
    ({ userRegistration, onSubmit, onInvalid, isTitleVisible = true }: CredentialsFormProps, ref) => {
        const { credentialsSchema } = RegistrationSchemas();
        const styles = AddressStyles();
        const {
            control,
            handleSubmit,
            formState: { errors },
            reset,
        } = useForm<Credentials>({
            resolver: yupResolver(credentialsSchema),
            defaultValues: getDefaultValues(userRegistration),
        });

        useFocusEffect(
            useCallback(() => {
                reset(getDefaultValues(userRegistration));
            }, [userRegistration, reset]),
        );

        useImperativeHandle(ref, () => ({
            submitForm: handleSubmit(
                (data) => {
                    onSubmit(data);
                },
                (invalidSubmit) => {
                    if (onInvalid) {
                        onInvalid(invalidSubmit);
                    }
                },
            ),
        }));

        return (
            <View>
                {isTitleVisible && (
                    <CustomTitle
                        title="Credenciais de acesso"
                        iconName="lock"
                        iconType={IconType.featherIcon}
                        iconSize={30}
                        textSize={24}
                    />
                )}
                <View style={styles.container}>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label="Password*"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value || ""}
                                error={errors.password?.message}
                                autoCorrect={false}
                                autoCapitalize="none"
                                textContentType="password"
                                secureTextEntry
                            />
                        )}
                    />
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label="Confirmar password*"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value || ""}
                                error={errors.confirmPassword?.message}
                                autoCorrect={false}
                                autoCapitalize="none"
                                textContentType="password"
                                secureTextEntry
                            />
                        )}
                    />
                </View>
            </View>
        );
    },
);

export default CredentialsForm;
