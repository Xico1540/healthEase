import React from "react";
import { View } from "react-native";
import RNPickerSelect, { PickerStyle } from "react-native-picker-select";
import { Control, Controller } from "react-hook-form";
import ErrorHolder from "@/src/components/common/errorHolder/ErrorHolder";
import MultiSelectPickerStyles from "@/src/components/inputs/multiSelectPicker/MultiSelectPickerStyles";
import CustomIcons, { IconType } from "@/src/components/icons/CustomIcons";
import LightTheme from "@/src/theme/LightTheme";

interface MultiSelectPickerProps {
    control: Control<any>;
    name: string;
    items: Array<{ label: string; value: string }>;
    placeholder?: string;
    defaultValue?: string;
    error?: string;
    styles: any;
    iconSize?: number;
    iconColor?: string;
    textColor?: string;
    textSize?: number;
    textFontFamily?: string;
    editable?: boolean;
}

const MultiSelectPicker = ({
    control,
    name,
    items,
    placeholder,
    defaultValue,
    error,
    styles,
    iconSize = 14,
    iconColor,
    textColor,
    textSize,
    textFontFamily,
    editable = true,
}: MultiSelectPickerProps) => {
    const pickerStyle: PickerStyle = MultiSelectPickerStyles();

    if (textColor && typeof pickerStyle.inputAndroid === "object" && typeof pickerStyle.inputIOS === "object") {
        pickerStyle.inputAndroid = {
            ...pickerStyle.inputAndroid,
            color: textColor,
        };
        pickerStyle.inputIOS = {
            ...pickerStyle.inputIOS,
            color: textColor,
        };
    }

    if (textSize && typeof pickerStyle.inputAndroid === "object" && typeof pickerStyle.inputIOS === "object") {
        pickerStyle.inputAndroid = {
            ...pickerStyle.inputAndroid,
            fontSize: textSize,
        };
        pickerStyle.inputIOS = {
            ...pickerStyle.inputIOS,
            fontSize: textSize,
        };
    }

    if (textFontFamily && typeof pickerStyle.inputAndroid === "object" && typeof pickerStyle.inputIOS === "object") {
        pickerStyle.inputAndroid = {
            ...pickerStyle.inputAndroid,
            fontFamily: textFontFamily,
        };
        pickerStyle.inputIOS = {
            ...pickerStyle.inputIOS,
            fontFamily: textFontFamily,
        };
    }

    return (
        <View style={styles.selectBox}>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <RNPickerSelect
                        onValueChange={onChange}
                        value={value || defaultValue || null}
                        style={pickerStyle}
                        useNativeAndroidPickerStyle={false}
                        Icon={() => (
                            <CustomIcons
                                icon={{
                                    value: { type: IconType.featherIcon, name: "chevron-down" },
                                    size: iconSize,
                                    color: iconColor || LightTheme.colors.white,
                                }}
                            />
                        )}
                        items={items}
                        placeholder={
                            defaultValue
                                ? { label: "", value: null }
                                : { label: placeholder || "Select an option", value: null }
                        }
                        disabled={!editable}
                    />
                )}
            />
            {error && <ErrorHolder errorMessage={error} />}
        </View>
    );
};

export default MultiSelectPicker;
