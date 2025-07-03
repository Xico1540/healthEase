import React, { useRef } from "react";
import { Address } from "@/src/model/UserRegistration";
import { StepProps } from "@/src/app/registration/RegistrationScreen";
import StepLayout from "@/src/components/layout/stepLayout/StepLayout";
import { SubmitFormRef } from "@/src/model/UtilModels";
import AddressForm from "@/src/app/registration/steps/AddressStep/AddressForm";

const AddressStep: React.FC<StepProps> = ({
    navigation,
    totalSteps,
    currentStep,
    userRegistration,
    setUserRegistration,
}) => {
    const formRef = useRef<SubmitFormRef>(null);

    const onSubmit = (data: Address) => {
        setUserRegistration({ ...userRegistration, address: data });
        navigation.navigate("HealthcareServiceStep");
    };

    return (
        <StepLayout
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={() => formRef.current?.submitForm()}
            onBack={() => navigation.goBack()}>
            <AddressForm ref={formRef} userRegistration={userRegistration} onSubmit={onSubmit} />
        </StepLayout>
    );
};

export default AddressStep;
