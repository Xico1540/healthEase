import React, { useRef } from "react";
import type { ContactPreferences } from "@/src/model/UserRegistration";
import { StepProps } from "@/src/app/registration/RegistrationScreen";
import StepLayout from "@/src/components/layout/stepLayout/StepLayout";
import { SubmitFormRef } from "@/src/model/UtilModels";
import ContactPreferencesForm from "@/src/app/registration/steps/ContactPreferencesStep/ContactPreferencesForm";

const ContactPreferencesStep: React.FC<StepProps> = ({
    navigation,
    totalSteps,
    currentStep,
    userRegistration,
    setUserRegistration,
}) => {
    const formRef = useRef<SubmitFormRef>(null);

    const onSubmit = (data: ContactPreferences) => {
        setUserRegistration({ ...userRegistration, contactPreferences: data });
        navigation.navigate("CredentialsStep");
    };

    return (
        <StepLayout
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={() => formRef.current?.submitForm()}
            onBack={() => navigation.goBack()}>
            <ContactPreferencesForm ref={formRef} userRegistration={userRegistration} onSubmit={onSubmit} />
        </StepLayout>
    );
};

export default ContactPreferencesStep;
