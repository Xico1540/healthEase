import { View } from "react-native";
import React from "react";
import {
    Control,
    Controller,
    DeepRequired,
    FieldErrorsImpl,
    FieldPath,
    FieldPathValue,
    GlobalError,
    SetValueConfig,
    SubmitErrorHandler,
    SubmitHandler,
    UseFormGetValues,
} from "react-hook-form";
import { darken } from "polished";
import UserProfileStyles from "@/src/app/userProfile/styles/UserProfileStyles";
import CustomTextInput from "@/src/components/inputs/textInputs/CustomTextInput";
import CustomDatePicker from "@/src/components/inputs/datePicker/CustomDatePicker";
import PhoneInput from "@/src/components/inputs/phoneInput/CustomPhoneInput";
import GenderEnum from "@/src/model/GenderEnum";
import Label from "@/src/components/common/label/Label";
import CustomTitle from "@/src/components/customTitle/CustomTitle";
import { IconType } from "@/src/components/icons/CustomIcons";
import LightTheme from "@/src/theme/LightTheme";
import Button from "@/src/components/buttons/CustomButton/Button";
import MultiSelectPicker from "@/src/components/inputs/multiSelectPicker/MultiSelectPicker";
import { useAuth } from "@/src/context/AuthProviderContext";
import { PractitionerUserData } from "@/src/model/PractitionerUserData";

export interface UserProfileScreenProps {
    control: Control<PractitionerUserData>;
    handleSubmit: (
        onValid: SubmitHandler<PractitionerUserData>,
        onInvalid?: SubmitErrorHandler<PractitionerUserData>,
    ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    isFormChanged: boolean;
    getValues: UseFormGetValues<PractitionerUserData>;
    setValue: (
        name: FieldPath<PractitionerUserData>,
        value: FieldPathValue<PractitionerUserData, any>,
        config?: SetValueConfig,
    ) => void;
    errors: Partial<FieldErrorsImpl<DeepRequired<PractitionerUserData>>> & {
        root?: Record<string, GlobalError> & GlobalError;
    };
    handleFormSubmit: SubmitHandler<PractitionerUserData>;
    isPatient: boolean | undefined;
}

const UserProfileEditView = ({
    control,
    errors,
    setValue,
    getValues,
    handleSubmit,
    handleFormSubmit,
    isFormChanged,
    isPatient,
}: UserProfileScreenProps) => {
    const styles = UserProfileStyles();
    const { userDetails } = useAuth();
    const genderOptions = Object.values(GenderEnum).map((gender) => ({
        label: gender === "male" ? "Masculino" : "Feminino",
        value: gender,
    }));
    const userData: PractitionerUserData = getValues();

    return (
        <>
            <View style={styles.cardContainer}>
                <CustomTitle
                    title="Informações Pessoais"
                    iconName="person-circle-outline"
                    iconType={IconType.Ionicon}
                    textColor={LightTheme.colors.primary}
                    iconSize={25}
                    textSize={16}
                    alignSelf="flex-start"
                />
                <View style={styles.formContent}>
                    <View style={styles.labelsContainer}>
                        <Controller
                            control={control}
                            name="personalInformation.firstName"
                            render={({ field: { onChange, value, onBlur } }) => (
                                <CustomTextInput
                                    textSize={15}
                                    textFontFamily="PoppinsMedium"
                                    labelFontFamily="PoppinsMedium"
                                    textColor={LightTheme.colors.primary}
                                    label="Primeiro Nome*"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    defaultValue={value}
                                    error={errors.personalInformation?.firstName?.message}
                                />
                            )}
                        />
                    </View>

                    <View style={styles.labelsContainer}>
                        <Controller
                            control={control}
                            name="personalInformation.lastName"
                            render={({ field: { onChange, value, onBlur } }) => (
                                <CustomTextInput
                                    textSize={15}
                                    textFontFamily="PoppinsMedium"
                                    labelFontFamily="PoppinsMedium"
                                    textColor={LightTheme.colors.primary}
                                    label="Sobrenome*"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    defaultValue={value}
                                    error={errors.personalInformation?.lastName?.message}
                                />
                            )}
                        />
                    </View>

                    <View style={styles.labelsContainer}>
                        <Controller
                            control={control}
                            name="personalInformation.dateOfBirth"
                            render={({ field: { onChange, value } }) => (
                                <CustomDatePicker
                                    onChange={onChange}
                                    label="Data de Nascimento*"
                                    labelFontFamily="PoppinsMedium"
                                    value={userData ? value : new Date()}
                                    placeholder="Selecione a data de nascimento"
                                    maxDate={new Date()}
                                    minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 120))}
                                    error={errors.personalInformation?.dateOfBirth?.message}
                                />
                            )}
                        />
                    </View>

                    <View style={styles.labelsContainer}>
                        <View style={styles.pickerContainer}>
                            <Label title="Sexo" fontFamily="PoppinsMedium" />
                            <MultiSelectPicker
                                control={control}
                                name="personalInformation.gender"
                                defaultValue={getValues("personalInformation.gender")}
                                items={genderOptions}
                                error={errors.personalInformation?.gender?.message}
                                styles={styles}
                                textSize={15}
                                textFontFamily="PoppinsMedium"
                                textColor={LightTheme.colors.primary}
                                iconColor={darken(0.2, LightTheme.colors.muted)}
                            />
                        </View>
                    </View>

                    {isPatient ? (
                        <View style={styles.labelsContainer}>
                            <Controller
                                control={control}
                                name="personalInformation.healthcareServiceIdentifier"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput
                                        textSize={15}
                                        textFontFamily="PoppinsMedium"
                                        labelFontFamily="PoppinsMedium"
                                        textColor={LightTheme.colors.primary}
                                        label="Nº utente*"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        defaultValue={value ? value.toString() : ""}
                                        keyboardType="numeric"
                                        error={errors.personalInformation?.healthcareServiceIdentifier?.message}
                                        editable={false}
                                    />
                                )}
                            />
                        </View>
                    ) : undefined}

                    <View style={styles.labelsContainer}>
                        <Controller
                            control={control}
                            name="personalInformation.address.street"
                            render={({ field: { onChange, value, onBlur } }) => (
                                <CustomTextInput
                                    textSize={15}
                                    textFontFamily="PoppinsMedium"
                                    labelFontFamily="PoppinsMedium"
                                    textColor={LightTheme.colors.primary}
                                    label="Morada*"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    defaultValue={value}
                                    error={errors.personalInformation?.address?.street?.message}
                                />
                            )}
                        />
                    </View>

                    <View style={styles.labelsContainer}>
                        <Controller
                            control={control}
                            name="personalInformation.address.postalCode"
                            render={({ field: { onChange, value, onBlur } }) => (
                                <CustomTextInput
                                    textSize={15}
                                    textFontFamily="PoppinsMedium"
                                    labelFontFamily="PoppinsMedium"
                                    textColor={LightTheme.colors.primary}
                                    label="Código Postal*"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    defaultValue={value}
                                    error={errors.personalInformation?.address?.postalCode?.message}
                                />
                            )}
                        />
                    </View>

                    <View style={styles.labelsContainer}>
                        <Controller
                            control={control}
                            name="personalInformation.address.city"
                            render={({ field: { onChange, value, onBlur } }) => (
                                <CustomTextInput
                                    textSize={15}
                                    textFontFamily="PoppinsMedium"
                                    labelFontFamily="PoppinsMedium"
                                    textColor={LightTheme.colors.primary}
                                    label="Cidade*"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    defaultValue={value}
                                    error={errors.personalInformation?.address?.city?.message}
                                />
                            )}
                        />
                    </View>
                </View>
            </View>

            {!isPatient ? (
                <View style={styles.cardContainer}>
                    <CustomTitle
                        title="Dados profissionais"
                        iconName="book"
                        iconType={IconType.featherIcon}
                        textColor={LightTheme.colors.primary}
                        iconSize={25}
                        textSize={16}
                        alignSelf="flex-start"
                    />
                    <View style={styles.formContent}>
                        <View style={styles.labelsContainer}>
                            <Controller
                                control={control}
                                name="profissionalData.educationInstitution"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput
                                        textSize={15}
                                        textFontFamily="PoppinsMedium"
                                        labelFontFamily="PoppinsMedium"
                                        textColor={LightTheme.colors.primary}
                                        label="Instituição de formação"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        defaultValue={value}
                                        error={errors.personalInformation?.address?.city?.message}
                                    />
                                )}
                            />
                        </View>
                        <View style={styles.labelsContainer}>
                            <Controller
                                control={control}
                                name="profissionalData.about"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput
                                        isTextArea
                                        textSize={15}
                                        textFontFamily="PoppinsMedium"
                                        labelFontFamily="PoppinsMedium"
                                        textColor={LightTheme.colors.primary}
                                        label="Sobre mim"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        defaultValue={value}
                                        error={errors.personalInformation?.address?.city?.message}
                                    />
                                )}
                            />
                        </View>
                    </View>
                </View>
            ) : undefined}

            <View style={styles.cardContainer}>
                <CustomTitle
                    title="Contactos"
                    iconName="call-outline"
                    iconType={IconType.Ionicon}
                    textColor={LightTheme.colors.primary}
                    iconSize={25}
                    textSize={16}
                    alignSelf="flex-start"
                />
                <View style={styles.formContent}>
                    <View style={styles.labelsContainer}>
                        <PhoneInput
                            control={control}
                            name="contacts.phoneNumber"
                            defaultPhoneNumber={
                                userDetails?.telecom?.find((t: any) => t.system === "phone")?.value || ""
                            }
                            error={errors.contacts?.phoneNumber}
                            setValue={setValue}
                            textFontFamily="PoppinsMedium"
                            textSize={15}
                            textColor={LightTheme.colors.primary}
                            labelFontFamily="PoppinsMedium"
                        />
                    </View>

                    <View style={styles.labelsContainer}>
                        <Controller
                            control={control}
                            name="contacts.email"
                            render={({ field: { onChange, value, onBlur } }) => (
                                <CustomTextInput
                                    textSize={15}
                                    textFontFamily="PoppinsMedium"
                                    labelFontFamily="PoppinsMedium"
                                    textColor={LightTheme.colors.primary}
                                    label="Email*"
                                    keyboardType="email-address"
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    defaultValue={value}
                                    error={errors.contacts?.email?.message}
                                />
                            )}
                        />
                    </View>
                </View>
            </View>
            <Button
                variant="secondary"
                text="Guardar"
                textColor={!isFormChanged ? LightTheme.colors.secondaryText : LightTheme.colors.white}
                onPress={handleSubmit(handleFormSubmit)}
                isDisabled={!isFormChanged}
            />
        </>
    );
};

export default UserProfileEditView;
