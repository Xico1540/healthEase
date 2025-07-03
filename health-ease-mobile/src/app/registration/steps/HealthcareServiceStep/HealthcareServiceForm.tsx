import React, { forwardRef, useImperativeHandle } from "react";
import { View } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldErrors, useForm } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/core";
import { HealthID, UserRegistration } from "@/src/model/UserRegistration";
import RegistrationSchemas from "@/src/validations/yup/registrationSchemas";
import { IconType } from "@/src/components/icons/CustomIcons";
import CustomTitle from "@/src/components/customTitle/CustomTitle";
import HealthcareForm from "@/src/components/common/healthcareForm/HealthcareForm";

interface HealthcareServiceFormProps {
    userRegistration: UserRegistration;
    onSubmit: (data: HealthID) => void;
    onInvalid?: (invalidSubmit: FieldErrors<UserRegistration>) => void;
    isTitleVisible?: boolean;
}

const getDefaultValues = (userRegistration: UserRegistration) =>
    userRegistration.healthID || {
        value: undefined,
    };

const HealthcareServiceForm = forwardRef(
    ({ userRegistration, onSubmit, onInvalid, isTitleVisible = true }: HealthcareServiceFormProps, ref) => {
        const { healthIDSchema } = RegistrationSchemas();
        const [cardContainerWidth, setCardContainerWidth] = React.useState(0);
        const {
            control,
            handleSubmit,
            formState: { errors },
            reset,
        } = useForm<HealthID>({
            resolver: yupResolver(healthIDSchema),
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
                        title="Serviço de Saúde"
                        iconName="key"
                        iconType={IconType.featherIcon}
                        iconSize={30}
                        textSize={24}
                    />
                )}
                <HealthcareForm
                    cardContainerWidth={cardContainerWidth}
                    setCardContainerWidth={setCardContainerWidth}
                    control={control}
                    errors={errors}
                />
            </View>
        );
    },
);

export default HealthcareServiceForm;
