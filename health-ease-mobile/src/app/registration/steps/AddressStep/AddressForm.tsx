import React, { forwardRef, useCallback, useImperativeHandle } from "react";
import { View } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/core";
import { Address, UserRegistration } from "@/src/model/UserRegistration";
import RegistrationSchemas from "@/src/validations/yup/registrationSchemas";
import { IconType } from "@/src/components/icons/CustomIcons";
import CustomTextInput from "@/src/components/inputs/textInputs/CustomTextInput";
import CustomTitle from "@/src/components/customTitle/CustomTitle";
import AddressStyles from "@/src/app/registration/steps/AddressStep/AddressStyles";

interface AddressFormProps {
    userRegistration: UserRegistration;
    onSubmit: (data: Address) => void;
    onInvalid?: (invalidSubmit: FieldErrors<UserRegistration>) => void;
    isTitleVisible?: boolean;
}

const getDefaultValues = (userRegistration: UserRegistration) => ({
    street: userRegistration.address?.street || undefined,
    city: userRegistration.address?.city || undefined,
    postalCode: userRegistration.address?.postalCode || undefined,
});

const AddressForm = forwardRef(
    ({ userRegistration, onSubmit, onInvalid, isTitleVisible = true }: AddressFormProps, ref) => {
        const { addressSchema } = RegistrationSchemas();
        const styles = AddressStyles();
        const {
            control,
            handleSubmit,
            formState: { errors },
            reset,
        } = useForm<Address>({
            resolver: yupResolver(addressSchema),
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
                        title="Morada"
                        iconName="map-pin"
                        iconType={IconType.featherIcon}
                        iconSize={30}
                        textSize={24}
                    />
                )}
                <View style={styles.container}>
                    <Controller
                        name="street"
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label="Rua*"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value || ""}
                                error={errors.street?.message}
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                        )}
                    />
                    <Controller
                        name="postalCode"
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label="Código postal*"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value || ""}
                                error={errors.postalCode?.message}
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                        )}
                    />
                    <Controller
                        name="city"
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label="Cidade/Localidade*"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value || ""}
                                error={errors.city?.message}
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

export default AddressForm;
