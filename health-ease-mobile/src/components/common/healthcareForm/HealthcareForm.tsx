import { View } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AutoAdjustImage from "@/src/components/common/AutoAdjustImage";
import idCardPT from "@/src/assets/images/id_card_pt.png";
import CustomTextInput from "@/src/components/inputs/textInputs/CustomTextInput";
import HealthcareStyle from "@/src/components/common/healthcareForm/HealthcareStyle";

interface HealthcareFormProps {
    cardContainerWidth: number;
    setCardContainerWidth: (width: number) => void;
    control: any;
    errors: any;
    isEditable?: boolean;
}

const HealthcareForm = ({
    cardContainerWidth,
    setCardContainerWidth,
    control,
    errors,
    isEditable = true,
}: HealthcareFormProps) => {
    const styles = HealthcareStyle();
    return (
        <View style={styles.container}>
            <View
                style={styles.cardContainer}
                onLayout={(event) => setCardContainerWidth(event.nativeEvent.layout.width)}>
                <AutoAdjustImage source={idCardPT} width={cardContainerWidth} imageStyle={styles.card} />
            </View>
            <Controller
                control={control}
                name="healthcareServiceIdentifier"
                render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextInput
                        label="Nº de Utente de Saúde"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ? value.toString() : ""}
                        error={errors.healthcareServiceIdentifier?.message}
                        keyboardType="numeric"
                        editable={isEditable}
                    />
                )}
            />
        </View>
    );
};

export default HealthcareForm;
