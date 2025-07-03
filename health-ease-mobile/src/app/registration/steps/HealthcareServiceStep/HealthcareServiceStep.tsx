import React, { useRef } from "react";
import type { HealthID } from "@/src/model/UserRegistration";
import { StepProps } from "@/src/app/registration/RegistrationScreen";
import HealthcareServiceForm from "@/src/app/registration/steps/HealthcareServiceStep/HealthcareServiceForm";
import { SubmitFormRef } from "@/src/model/UtilModels";
import StepLayout from "@/src/components/layout/stepLayout/StepLayout";

const HealthcareServiceStep: React.FC<StepProps> = ({
    navigation,
    totalSteps,
    currentStep,
    userRegistration,
    setUserRegistration,
}) => {
    const formRef = useRef<SubmitFormRef>(null);

    const onSubmit = (data: HealthID) => {
        setUserRegistration({ ...userRegistration, healthID: data });
        navigation.navigate("ContactPreferencesStep");
    };

    return (
        <StepLayout
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={() => formRef.current?.submitForm()}
            onBack={() => navigation.goBack()}>
            <HealthcareServiceForm ref={formRef} userRegistration={userRegistration} onSubmit={onSubmit} />
        </StepLayout>
    );
};

export default HealthcareServiceStep;
