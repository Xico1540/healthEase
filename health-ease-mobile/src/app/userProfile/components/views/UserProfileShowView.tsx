import { Text, View } from "react-native";
import React from "react";
import { Control, Controller, UseFormGetValues } from "react-hook-form";
import { isNil } from "lodash";
import UserProfileStyles from "@/src/app/userProfile/styles/UserProfileStyles";
import Label from "@/src/components/common/label/Label";
import { PractitionerUserData } from "@/src/model/PractitionerUserData";
import { useCustomAlert } from "@/src/components/customAlert/CustomAlertProvider";
import CustomTitle from "@/src/components/customTitle/CustomTitle";
import { IconType } from "@/src/components/icons/CustomIcons";
import Button from "@/src/components/buttons/CustomButton/Button";
import LightTheme from "@/src/theme/LightTheme";
import { useAuth } from "@/src/context/AuthProviderContext";

export interface UserProfileShowViewProps {
    control: Control<PractitionerUserData>;
    getValues: UseFormGetValues<PractitionerUserData>;
    isPatient: boolean | undefined;
}

const getGenderOptions = (): any => ({
    male: "Masculino",
    female: "Feminino",
});

const UserProfileShowView = ({ control, getValues, isPatient }: UserProfileShowViewProps) => {
    const styles = UserProfileStyles();
    const { showAlert } = useCustomAlert();
    const userData: PractitionerUserData = getValues();
    const { logout } = useAuth();

    const handleLogout = async () => {
        const dialogOption = await showAlert({
            type: "dialog",
            title: "Logout",
            message: "Deseja realmente terminar sessão?",
            buttons: ["yes", "no"],
        });
        if (dialogOption) {
            logout();
        }
    };

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
                        <Label title="Nome" fontFamily="PoppinsMedium" />
                        <Controller
                            control={control}
                            name="personalInformation.firstName"
                            render={({ field: { value } }) => <Text style={styles.labelValueText}>{value}</Text>}
                        />
                    </View>

                    <View style={styles.labelsContainer}>
                        <Label title="Sobrenome" fontFamily="PoppinsMedium" />
                        <Controller
                            control={control}
                            name="personalInformation.lastName"
                            render={({ field: { value } }) => <Text style={styles.labelValueText}>{value}</Text>}
                        />
                    </View>

                    <View style={styles.labelsContainer}>
                        <Label title="Data de nascimento" fontFamily="PoppinsMedium" />
                        <Controller
                            control={control}
                            name="personalInformation.dateOfBirth"
                            render={({ field: { value } }) => (
                                <Text style={styles.labelValueText}>
                                    {userData.personalInformation && !isNil(value) ? value.toLocaleDateString() : ""}
                                </Text>
                            )}
                        />
                    </View>

                    <View style={styles.labelsContainer}>
                        <Label title="Sexo" fontFamily="PoppinsMedium" />
                        <Controller
                            control={control}
                            name="personalInformation.gender"
                            render={({ field: { value } }) => (
                                <Text style={styles.labelValueText}>{getGenderOptions()[value]}</Text>
                            )}
                        />
                    </View>

                    {isPatient ? (
                        <View style={styles.labelsContainer}>
                            <Label title="Nº utente de saúde" fontFamily="PoppinsMedium" />
                            <Controller
                                control={control}
                                name="personalInformation.healthcareServiceIdentifier"
                                render={({ field: { value } }) => (
                                    <Text style={styles.labelValueText}>
                                        {userData.personalInformation ? value : ""}
                                    </Text>
                                )}
                            />
                        </View>
                    ) : undefined}

                    <View style={styles.labelsContainer}>
                        <Label title="Morada" fontFamily="PoppinsMedium" />
                        <Controller
                            control={control}
                            name="personalInformation.address.street"
                            render={({ field: { value } }) => <Text style={styles.labelValueText}>{value}</Text>}
                        />
                    </View>

                    <View style={styles.labelsContainer}>
                        <Label title="Código postal" fontFamily="PoppinsMedium" />
                        <Controller
                            control={control}
                            name="personalInformation.address.postalCode"
                            render={({ field: { value } }) => <Text style={styles.labelValueText}>{value}</Text>}
                        />
                    </View>

                    <View style={styles.labelsContainer}>
                        <Label title="Cidade" fontFamily="PoppinsMedium" />
                        <Controller
                            control={control}
                            name="personalInformation.address.city"
                            render={({ field: { value } }) => <Text style={styles.labelValueText}>{value}</Text>}
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
                            <Label title="Instituição de formação" fontFamily="PoppinsMedium" />
                            <Controller
                                control={control}
                                name="profissionalData.educationInstitution"
                                render={({ field: { value } }) => <Text style={styles.labelValueText}>{value}</Text>}
                            />
                        </View>
                        <View style={styles.labelsContainer}>
                            <Label title="Sobre mim" fontFamily="PoppinsMedium" />
                            <Controller
                                control={control}
                                name="profissionalData.about"
                                render={({ field: { value } }) => <Text style={styles.labelValueText}>{value}</Text>}
                            />
                        </View>
                    </View>
                </View>
            ) : undefined}

            <View style={styles.cardContainer}>
                <CustomTitle
                    title="Contactos"
                    iconName="phone-call"
                    iconType={IconType.featherIcon}
                    textColor={LightTheme.colors.primary}
                    iconSize={25}
                    textSize={16}
                    alignSelf="flex-start"
                />
                <View style={styles.formContent}>
                    <View style={styles.labelsContainer}>
                        <Label title="Número de telefone" fontFamily="PoppinsMedium" />
                        <Controller
                            control={control}
                            name="contacts.phoneNumber"
                            render={({ field: { value } }) => <Text style={styles.labelValueText}>{value}</Text>}
                        />
                    </View>

                    <View style={styles.labelsContainer}>
                        <Label title="Email" fontFamily="PoppinsMedium" />
                        <Controller
                            control={control}
                            name="contacts.email"
                            render={({ field: { value } }) => <Text style={styles.labelValueText}>{value}</Text>}
                        />
                    </View>
                </View>
            </View>

            <Button
                onPress={handleLogout}
                variant="error"
                text="Terminar sessão"
                iconSize={20}
                styleLayout={styles.buttonLayout}
                iconColor={LightTheme.colors.white}
                textColor={LightTheme.colors.white}
            />
        </>
    );
};

export default UserProfileShowView;
