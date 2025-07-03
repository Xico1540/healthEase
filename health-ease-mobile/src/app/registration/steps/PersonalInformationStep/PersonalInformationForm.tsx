import React, { forwardRef, useImperativeHandle } from "react";
import { View } from "react-native";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect } from "@react-navigation/core";
import GenderEnum from "@/src/model/GenderEnum";
import { PersonalInfo, UserRegistration } from "@/src/model/UserRegistration";

import PersonalInformationStyle from "@/src/app/registration/steps/PersonalInformationStep/PersonalInformationStyle";
import RegistrationSchemas from "@/src/validations/yup/registrationSchemas";
import CustomTitle from "@/src/components/customTitle/CustomTitle";
import { IconType } from "@/src/components/icons/CustomIcons";
import CustomTextInput from "@/src/components/inputs/textInputs/CustomTextInput";
import Label from "@/src/components/common/label/Label";
import SwitchButton from "@/src/components/buttons/SwitchButton/SwitchButtons";
import CustomDatePicker from "@/src/components/inputs/datePicker/CustomDatePicker";

interface PersonalInformationFormProps {
    onSubmit: (data: PersonalInfo) => void;
    userRegistration: UserRegistration;
    onInvalid?: (invalidSubmit: FieldErrors<UserRegistration>) => void;
    isTitleVisible?: boolean;
}

const getDefaultValues = (userRegistration: UserRegistration) =>
    userRegistration.personalInfo || {
        firstName: undefined,
        lastName: undefined,
        gender: GenderEnum.Male,
        dateOfBirth: undefined,
    };

const PersonalInformationForm = forwardRef(
    ({ userRegistration, onSubmit, onInvalid, isTitleVisible = true }: PersonalInformationFormProps, ref) => {
        const { personalInfoSchema } = RegistrationSchemas();
        const styles = PersonalInformationStyle();
        const {
            control,
            handleSubmit,
            formState: { errors },
            reset,
        } = useForm<PersonalInfo>({
            resolver: yupResolver(personalInfoSchema),
            defaultValues: getDefaultValues(userRegistration),
        });

        useFocusEffect(
            React.useCallback(() => {
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
                        title="Informações Pessoais"
                        iconName="user"
                        iconType={IconType.featherIcon}
                        iconSize={30}
                        textSize={24}
                    />
                )}
                <View style={styles.container}>
                    <Controller
                        control={control}
                        name="firstName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label="Nome*"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.firstName?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="lastName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label="Sobrenome*"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.lastName?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="gender"
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <Label title="Gênero*" />
                                <SwitchButton
                                    options={["Masculino", "Feminino"]}
                                    selectedOption={
                                        value === GenderEnum.Male
                                            ? "Masculino"
                                            : value === GenderEnum.Female
                                              ? "Feminino"
                                              : ""
                                    }
                                    onSelect={(option) =>
                                        onChange(option === "Masculino" ? GenderEnum.Male : GenderEnum.Female)
                                    }
                                />
                            </View>
                        )}
                    />
                    <Controller
                        control={control}
                        name="dateOfBirth"
                        render={({ field: { onChange, value } }) => (
                            <CustomDatePicker
                                label="Data de Nascimento*"
                                value={value}
                                onChange={onChange}
                                placeholder="Selecione a data de nascimento"
                                maxDate={new Date()}
                                minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 120))}
                                error={errors.dateOfBirth?.message}
                            />
                        )}
                    />
                </View>
            </View>
        );
    },
);

export default PersonalInformationForm;
