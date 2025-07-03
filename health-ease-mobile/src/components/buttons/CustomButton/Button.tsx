import React from "react";
import { ActivityIndicator, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import CustomIcons, { IconType } from "@/src/components/icons/CustomIcons";
import LightTheme from "@/src/theme/LightTheme";
import ButtonStyles from "@/src/components/buttons/CustomButton/ButtonStyles";

type RoundedButtonProps = {
    onPress?: () => void;
    text?: string;
    textColor?: string;
    textSize?: number;
    textFontFamily?: string;
    variant?: "primary" | "secondary" | "tertiary" | "muted" | "link" | "error";
    isMuted?: boolean;
    iconName?: string;
    iconType?: IconType;
    iconSize?: number;
    iconColor?: string;
    style?: StyleProp<ViewStyle>;
    styleLayout?: StyleProp<ViewStyle>;
    isLoading?: boolean;
    isDisabled?: boolean;
    centerText?: boolean;
};

const getButtonTextColor = (
    variant: "primary" | "secondary" | "tertiary" | "muted" | "link" | "error",
    isDisabled: boolean,
): string => {
    if (isDisabled) {
        return LightTheme.colors.secondaryText;
    }
    if (variant === "secondary") {
        return LightTheme.colors.secondary;
    }
    if (variant === "primary") {
        return LightTheme.colors.primary;
    }
    return LightTheme.colors.text;
};

const Button: React.FC<RoundedButtonProps> = ({
    onPress,
    text,
    textColor,
    textSize,
    textFontFamily = "PoppinsRegular",
    variant = "primary",
    isMuted = false,
    iconName,
    iconType,
    iconSize = 30,
    iconColor = "#000",
    style,
    styleLayout,
    isLoading = false,
    isDisabled = false,
    centerText = false,
}) => {
    const styles = ButtonStyles();

    let buttonStyles: StyleProp<ViewStyle> = [styles.buttonContainer, styles[variant]];
    if (isMuted || isDisabled) {
        buttonStyles = [buttonStyles, LightTheme.colors.muted as any];
    }

    const conditionalStyles: TextStyle = {};
    if (textFontFamily) {
        conditionalStyles.fontFamily = textFontFamily;
    }
    if (textSize) {
        conditionalStyles.fontSize = textSize;
    }
    if (centerText) {
        conditionalStyles.textAlign = "center";
    }

    const defaultTextColor = textColor || getButtonTextColor(variant, isDisabled);

    return (
        <TouchableOpacity
            style={[buttonStyles, style]}
            onPress={isLoading || isDisabled ? undefined : onPress}
            disabled={isLoading || isDisabled}>
            <View style={[styles.buttonLayout, styleLayout]}>
                <Text style={[styles.text, { color: defaultTextColor }, conditionalStyles]}>{text}</Text>
                {isLoading && <ActivityIndicator color={defaultTextColor} style={styles.spinner} />}
                {iconName && iconType && (
                    <CustomIcons
                        icon={{
                            value: { type: iconType, name: iconName as any },
                            size: iconSize,
                            color: iconColor,
                        }}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

export default Button;
