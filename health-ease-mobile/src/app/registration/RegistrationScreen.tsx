import * as React from "react";
import { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Control, FieldErrors } from "react-hook-form";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/core";
import { UserRegistration } from "@/src/model/UserRegistration";
import HealthcareServiceStep from "@/src/app/registration/steps/HealthcareServiceStep/HealthcareServiceStep";
import ConfirmationStep from "@/src/app/registration/steps/ConfirmationStep/ConfirmationStep";
import ContactPreferencesStep from "@/src/app/registration/steps/ContactPreferencesStep/ContactPreferencesStep";
import PersonalInformationStep from "@/src/app/registration/steps/PersonalInformationStep/PersonalInformationStep";
import { useCustomAlert } from "@/src/components/customAlert/CustomAlertProvider";
import RouteHeader from "@/src/components/headers/routeHeader/RouteHeader";
import LightTheme from "@/src/theme/LightTheme";
import AddressStep from "@/src/app/registration/steps/AddressStep/AddressStep";
import CredentialsStep from "@/src/app/registration/steps/CredentialsStep/CredentialsStep";

const Stack = createStackNavigator<RootStackParamList>();

export type StepProps = {
    totalSteps: number;
    currentStep: number;
    navigation: any;
    route: any;
    control: Control<UserRegistration>;
    errors: FieldErrors<UserRegistration>;
    userRegistration: UserRegistration;
    setUserRegistration: React.Dispatch<React.SetStateAction<UserRegistration>>;
    setIsLastStep: React.Dispatch<React.SetStateAction<boolean>>;
};

export type RootStackParamList = {
    PersonalInformationStep: undefined;
    AddressStep: undefined;
    HealthcareServiceStep: undefined;
    ContactPreferencesStep: undefined;
    CredentialsStep: undefined;
    ConfirmationStep: undefined;
};

const steps: { name: keyof RootStackParamList; component: React.ComponentType<StepProps> }[] = [
    { name: "PersonalInformationStep", component: PersonalInformationStep },
    { name: "ContactPreferencesStep", component: ContactPreferencesStep },
    { name: "HealthcareServiceStep", component: HealthcareServiceStep },
    { name: "AddressStep", component: AddressStep },
    { name: "CredentialsStep", component: CredentialsStep },
    { name: "ConfirmationStep", component: ConfirmationStep },
];

const RegistrationScreen: React.FC = () => {
    const title = "Registo do Utilizador";
    const totalSteps = steps.length;
    const [userRegistration, setUserRegistration] = useState<UserRegistration>({} as UserRegistration);
    const localNavigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [isLastStep, setIsLastStep] = useState<boolean>(false);
    const { showAlert } = useCustomAlert();

    const handleGoBack = async (stepperNavigation: NavigationProp<RootStackParamList>) => {
        if (isLastStep) {
            stepperNavigation.goBack();
        } else {
            const response = await showAlert({
                type: "dialog",
                title: "Voltar atrás",
                message: "Tem a certeza que deseja voltar atrás? Os dados inseridos serão perdidos.",
                buttons: ["yes", "no"],
            });
            if (response) {
                localNavigation.goBack();
            }
        }
        setIsLastStep(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: LightTheme.colors.white }}>
            <RouteHeader title={title} goBack onGoBack={() => handleGoBack(localNavigation)} />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>
                {steps.map((step, index) => (
                    <Stack.Screen key={step.name} name={step.name}>
                        {(props) =>
                            React.createElement(step.component, {
                                ...props,
                                totalSteps,
                                currentStep: index + 1,
                                userRegistration,
                                setIsLastStep,
                                setUserRegistration,
                            } as StepProps)
                        }
                    </Stack.Screen>
                ))}
            </Stack.Navigator>
        </View>
    );
};

export default RegistrationScreen;
