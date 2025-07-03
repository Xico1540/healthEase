import React, { useRef } from "react";
import { Credentials } from "@/src/model/UserRegistration";
import { StepProps } from "@/src/app/registration/RegistrationScreen";
import StepLayout from "@/src/components/layout/stepLayout/StepLayout";
import { SubmitFormRef } from "@/src/model/UtilModels";
import CredentialsForm from "@/src/app/registration/steps/CredentialsStep/CredentialsForm";

const CredentialsStep: React.FC<StepProps> = ({
    navigation,
    totalSteps,
    currentStep,
    userRegistration,
    setUserRegistration,
}) => {
    const formRef = useRef<SubmitFormRef>(null);

    const onSubmit = (data: Credentials) => {
        setUserRegistration({ ...userRegistration, password: data });
        navigation.navigate("ConfirmationStep");
    };

    return (
        <StepLayout
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={() => formRef.current?.submitForm()}
            onBack={() => navigation.goBack()}>
            <CredentialsForm ref={formRef} userRegistration={userRegistration} onSubmit={onSubmit} />
        </StepLayout>
    );
};

export default CredentialsStep;
