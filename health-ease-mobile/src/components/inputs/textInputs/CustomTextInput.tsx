import React, { useEffect, useState } from "react";
import {
    NativeSyntheticEvent,
    Text,
    TextInput,
    TextInputChangeEventData,
    TextInputProps,
    TextStyle,
    View,
} from "react-native";
import { isNil } from "lodash";
import CreateCustomTextInputStyles from "@/src/components/inputs/textInputs/CustomTextInputStyles";
import ErrorHolder from "@/src/components/common/errorHolder/ErrorHolder";
import Label from "@/src/components/common/label/Label";
import HelperHolder from "@/src/components/common/helperHolder/HelperHolder";
import LightTheme from "@/src/theme/LightTheme";

interface CustomTextInputProps extends TextInputProps {
    label: string;
    textColor?: string;
    textFontFamily?: string;
    textSize?: number;
    error?: string;
    isTextArea?: boolean;
    numberOfLines?: number;
    labelFontFamily?: string;
    helperMessage?: string | React.ReactNode;
    onHelperPress?: () => void;
    maxLength?: number;
    defaultValue?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
    label,
    error,
    isTextArea = false,
    numberOfLines = 4,
    textColor,
    textSize,
    textFontFamily,
    onHelperPress,
    helperMessage,
    labelFontFamily = "PoppinsRegular",
    maxLength,
    defaultValue,
    value,
    ...props
}) => {
    const styles = CreateCustomTextInputStyles();
    const [charCount, setCharCount] = useState(defaultValue ? defaultValue.length : 0);
    const conditionalStyles: TextStyle = {};

    useEffect(() => {
        setCharCount(defaultValue ? defaultValue.length : 0);
    }, [defaultValue]);

    if (textColor) {
        conditionalStyles.color = textColor;
    }

    if (textFontFamily) {
        conditionalStyles.fontFamily = textFontFamily;
    }

    if (textSize) {
        conditionalStyles.fontSize = textSize;
    }

    const defaultMaxLength = isTextArea ? 500 : 100;

    const handleTextChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const { text } = e.nativeEvent;

        setCharCount(text.length);
        if (props.onChangeText) {
            props.onChangeText(text);
        }
    };

    return (
        <View style={styles.container}>
            <Label title={label} fontFamily={labelFontFamily} />
            <TextInput
                style={[styles.input, conditionalStyles, isTextArea && styles.textArea]}
                numberOfLines={isTextArea ? numberOfLines : 1}
                multiline={isTextArea}
                maxLength={maxLength ?? defaultMaxLength}
                onChange={handleTextChange}
                value={value}
                defaultValue={defaultValue}
                {...props}
            />
            <View style={styles.helperContainer}>
                {!isNil(helperMessage) && (
                    <HelperHolder helperMessage={helperMessage} onPress={onHelperPress} style={{ flex: 5 }} />
                )}
                <View style={styles.charContainer}>
                    {(isTextArea || charCount >= 0.8 * (maxLength ?? defaultMaxLength)) && (
                        <Text
                            style={[
                                styles.charCount,
                                {
                                    color:
                                        charCount >= (maxLength ?? defaultMaxLength)
                                            ? LightTheme.colors.error
                                            : LightTheme.colors.muted,
                                },
                            ]}>
                            {charCount}/{maxLength ?? defaultMaxLength}
                        </Text>
                    )}
                </View>
            </View>
            {error && <ErrorHolder errorMessage={error} />}
        </View>
    );
};

export default CustomTextInput;
