import React, { forwardRef, useCallback, useImperativeHandle } from "react";
import { View } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/core";
import { ContactPreferences, UserRegistration } from "@/src/model/UserRegistration";
import ContactPreferencesStyle from "@/src/app/registration/steps/ContactPreferencesStep/ContactPreferencesStyle";
import RegistrationSchemas from "@/src/validations/yup/registrationSchemas";
import { IconType } from "@/src/components/icons/CustomIcons";
import CustomTextInput from "@/src/components/inputs/textInputs/CustomTextInput";
import CustomTitle from "@/src/components/customTitle/CustomTitle";
import CustomPhoneInput from "@/src/components/inputs/phoneInput/CustomPhoneInput";

interface ContactPreferencesFormProps {
    userRegistration: UserRegistration;
    onSubmit: (data: ContactPreferences) => void;
    onInvalid?: (invalidSubmit: FieldErrors<UserRegistration>) => void;
    isTitleVisible?: boolean;
}

const getDefaultValues = (userRegistration: UserRegistration) => ({
    phoneNumber: userRegistration.contactPreferences?.phoneNumber || undefined,
    email: userRegistration.contactPreferences?.email || undefined,
});

const ContactPreferencesForm = forwardRef(
    ({ userRegistration, onSubmit, onInvalid, isTitleVisible = true }: ContactPreferencesFormProps, ref) => {
        const { contactPreferencesSchema } = RegistrationSchemas();
        const styles = ContactPreferencesStyle();
        const {
            control,
            handleSubmit,
            setValue,
            formState: { errors },
            reset,
        } = useForm<ContactPreferences>({
            resolver: yupResolver(contactPreferencesSchema),
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
                        title="Preferências de Contactos"
                        iconName="phone-call"
                        iconType={IconType.featherIcon}
                        iconSize={30}
                        textSize={24}
                    />
                )}
                <View style={styles.personalInfo}>
                    <CustomPhoneInput
                        control={control}
                        name="phoneNumber"
                        defaultPhoneNumber={userRegistration.contactPreferences?.phoneNumber || ""}
                        error={errors.phoneNumber}
                        setValue={setValue}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label="Email*"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value || ""}
                                error={errors.email?.message}
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                        )}
                    />
                </View>
            </View>
        );
    },
);

export default ContactPreferencesForm;
