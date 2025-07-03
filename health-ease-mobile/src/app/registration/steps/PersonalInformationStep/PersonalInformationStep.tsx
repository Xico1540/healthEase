import React, { useRef } from "react";
import type { PersonalInfo, UserRegistration } from "@/src/model/UserRegistration";
import { StepProps } from "@/src/app/registration/RegistrationScreen";
import StepLayout from "@/src/components/layout/stepLayout/StepLayout";
import { SubmitFormRef } from "@/src/model/UtilModels";
import PersonalInformationForm from "@/src/app/registration/steps/PersonalInformationStep/PersonalInformationForm";

const PersonalInformationStep: React.FC<StepProps> = ({
    navigation,
    totalSteps,
    currentStep,
    userRegistration,
    setUserRegistration,
}) => {
    const formRef = useRef<SubmitFormRef>(null);

    const onSubmit = (data: PersonalInfo) => {
        setUserRegistration({ ...userRegistration, personalInfo: data });
        navigation.navigate("AddressStep");
    };

    return (
        <StepLayout
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={() => formRef.current?.submitForm()}
            onBack={() => navigation.goBack()}>
            <PersonalInformationForm userRegistration={userRegistration} ref={formRef} onSubmit={onSubmit} />
        </StepLayout>
    );
};

export default PersonalInformationStep;
