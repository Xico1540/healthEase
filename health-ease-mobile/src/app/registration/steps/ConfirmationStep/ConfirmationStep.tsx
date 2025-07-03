import React, { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { StepProps } from "@/src/app/registration/RegistrationScreen";
import { FormComponentProps, SubmitFormRef } from "@/src/model/UtilModels";
import PersonalInformationForm from "@/src/app/registration/steps/PersonalInformationStep/PersonalInformationForm";
import ContactPreferencesForm from "@/src/app/registration/steps/ContactPreferencesStep/ContactPreferencesForm";
import HealthcareServiceForm from "@/src/app/registration/steps/HealthcareServiceStep/HealthcareServiceForm";
import ConfirmationStepStyle from "@/src/app/registration/steps/ConfirmationStep/ConfirmationStepStyle";
import { useCustomAlert } from "@/src/components/customAlert/CustomAlertProvider";
import CustomButton from "@/src/components/buttons/CustomButton/CustomButton";
import { IconType } from "@/src/components/icons/CustomIcons";
import { useLoading } from "@/src/context/LoadingContext";
import LightTheme from "@/src/theme/LightTheme";
import AddressForm from "@/src/app/registration/steps/AddressStep/AddressForm";
import CredentialsForm from "@/src/app/registration/steps/CredentialsStep/CredentialsForm";
import CustomTitle from "@/src/components/customTitle/CustomTitle";
import mapUserRegistration from "@/src/mappers/UserRegistrationMapper";
import UserService from "@/src/services/UserService";

interface FormErrors {
    [key: string]: boolean;
}

interface FormRefs {
    [key: string]: React.RefObject<SubmitFormRef>;
}

const ConfirmationStep: React.FC<StepProps> = ({ setIsLastStep, userRegistration, setUserRegistration }) => {
    const { showAlert } = useCustomAlert();
    const { setGlobalLoading } = useLoading();
    const userService = UserService.getInstance();
    const styles = ConfirmationStepStyle();
    const navigation = useNavigation<any>();

    useEffect(() => {
        setIsLastStep(true);
    }, []);

    const formComponents: FormComponentProps[] = useMemo(
        () => [
            { component: PersonalInformationForm, name: "personalInformation" },
            { component: ContactPreferencesForm, name: "contactPreferences" },
            { component: HealthcareServiceForm, name: "healthcareService" },
            { component: AddressForm, name: "address" },
            { component: CredentialsForm, name: "credentials" },
        ],
        [],
    );

    const formRefs = useMemo(() => {
        const refs: FormRefs = {};
        formComponents.forEach(({ name }) => {
            refs[name] = React.createRef<SubmitFormRef>();
        });
        return refs;
    }, [formComponents]);

    const formErrors = useRef<FormErrors>(formComponents.reduce((acc, { name }) => ({ ...acc, [name]: false }), {}));

    const [loading, setLoading] = useState(false);
    const updatedUserRegistration = useRef({ ...userRegistration });

    const setFieldError = (field: string, hasError: boolean) => {
        formErrors.current[field] = hasError;
    };

    const onSubmit = async () => {
        setGlobalLoading(true);
        setLoading(true);

        Object.keys(formErrors.current).forEach((key) => {
            formErrors.current[key] = false;
        });

        setTimeout(async () => {
            try {
                await Promise.all(Object.values(formRefs).map((ref) => ref.current?.submitForm()));
                const hasErrors = Object.values(formErrors.current).some((error) => error);
                if (hasErrors) {
                    setGlobalLoading(false);
                    setLoading(false);
                    await showAlert({
                        type: "error",
                        title: "Ocorreu um erro",
                        message: "Por favor, preencha todos os campos obrigatórios.",
                    });
                } else {
                    setUserRegistration(updatedUserRegistration.current);
                    userService.registerUser(mapUserRegistration(updatedUserRegistration.current)).then(
                        async () => {
                            setGlobalLoading(false);
                            setLoading(false);
                            navigation.navigate("login/screens/LoginScreen");
                            await showAlert({
                                type: "success",
                                title: "Registo efetuado com sucesso",
                                message:
                                    "O seu registo foi efetuado com sucesso.\nAgora você pode fazer login na sua conta.",
                            });
                        },
                        async () => {
                            setGlobalLoading(false);
                            setLoading(false);
                            await showAlert({
                                type: "error",
                                title: "Ocorreu um erro",
                                message: "Ocorreu um erro ao tentar registar-se. Por favor, tente novamente.",
                            });
                        },
                    );
                }
            } catch (error) {
                setGlobalLoading(false);
                setLoading(false);
                await showAlert({
                    type: "error",
                    title: "Ocorreu um erro",
                    message: "Ocorreu um erro ao tentar enviar o formulário. Por favor, tente novamente.",
                });
            }
        }, 0);
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView style={{ flex: 1 }} keyboardOpeningTime={0} extraScrollHeight={10}>
                <View style={styles.content}>
                    <CustomTitle
                        title="Resumo do registo"
                        iconName="file-text"
                        iconType={IconType.featherIcon}
                        iconSize={30}
                        textSize={24}
                    />
                    {formComponents.map(({ component: Component, name, props }) => (
                        <Component
                            key={name}
                            ref={formRefs[name]}
                            setUserRegistration={setUserRegistration}
                            userRegistration={userRegistration}
                            isTitleVisible={false}
                            {...props}
                            onSubmit={(data: any) => {
                                updatedUserRegistration.current[name as keyof typeof updatedUserRegistration.current] =
                                    data;
                                setFieldError(name, false);
                            }}
                            onInvalid={() => setFieldError(name, true)}
                        />
                    ))}
                    <View style={styles.buttonContainer}>
                        <CustomButton
                            title="Confirmar registo"
                            onPress={onSubmit}
                            icon={{ type: IconType.featherIcon, name: "check" }}
                            buttonStyle={[{ backgroundColor: LightTheme.colors.primary }]}
                            textStyle={{ color: LightTheme.colors.white }}
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default ConfirmationStep;
