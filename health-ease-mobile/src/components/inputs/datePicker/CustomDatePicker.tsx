import React, { useState } from "react";
import { Button as RNButton, Modal, Platform, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Label from "@/src/components/common/label/Label";
import useDatePickerStyles from "@/src/components/inputs/datePicker/CustomDatePickerStyles";
import { IconType } from "@/src/components/icons/CustomIcons";
import CustomButton from "@/src/components/buttons/CustomButton/CustomButton";
import ErrorHolder from "@/src/components/common/errorHolder/ErrorHolder";

interface CustomDatePickerProps {
    label: string;
    value: Date | undefined;
    onChange: (date: Date) => void;
    placeholder: string;
    error?: string;
    labelFontFamily?: string;
    editable?: boolean;
    minDate?: Date;
    maxDate?: Date;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    label,
    value,
    placeholder,
    onChange,
    labelFontFamily = "PoppinsRegular",
    editable = true,
    minDate,
    maxDate,
    error,
}) => {
    const [show, setShow] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(value || new Date());
    const styles = useDatePickerStyles();

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setTempDate(selectedDate);
            if (Platform.OS !== "ios") {
                setShow(false);
                onChange(selectedDate);
            }
        } else if (Platform.OS !== "ios") {
            setShow(false);
        }
    };

    const handleConfirm = () => {
        onChange(tempDate);
    };

    const handleCancel = () => {
        setShow(false);
    };

    return (
        <View style={styles.container}>
            <Label title={label} fontFamily={labelFontFamily} />
            <CustomButton
                onPress={() => setShow(true)}
                title={value ? value.toDateString() : placeholder}
                variant="muted"
                icon={{
                    type: IconType.featherIcon,
                    name: "calendar",
                }}
            />
            {show && (
                <View>
                    {Platform.OS === "ios" ? (
                        <Modal transparent animationType="slide">
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <DateTimePicker
                                        disabled={!editable}
                                        value={tempDate}
                                        mode="date"
                                        display="spinner"
                                        onChange={handleDateChange}
                                        minimumDate={minDate}
                                        maximumDate={maxDate}
                                    />
                                    <View style={styles.modalButtons}>
                                        <RNButton title="Cancelar" onPress={handleCancel} />
                                        <RNButton title="Confirmar" onPress={handleConfirm} />
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    ) : (
                        <DateTimePicker
                            disabled={!editable}
                            value={tempDate}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                            minimumDate={minDate}
                            maximumDate={maxDate}
                        />
                    )}
                </View>
            )}
            {error && <ErrorHolder errorMessage={error} />}
        </View>
    );
};

export default CustomDatePicker;
