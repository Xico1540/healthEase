import React from "react";
import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import CustomIcons, { IconType } from "@/src/components/icons/CustomIcons";
import RoundedButtonStyles from "@/src/components/buttons/RoundedButton/RoundedButtonStyles";
import LightTheme from "@/src/theme/LightTheme";

type RoundedButtonProps = {
    onPress?: () => void;
    text?: string;
    size?: "small" | "medium" | "large";
    variant?: "primary" | "secondary" | "link" | "muted";
    iconName?: string;
    iconSize?: number;
    iconColor?: string;
    textColor?: string;
    iconType?: IconType;
    style?: StyleProp<ViewStyle>;
    textWeight?: "bold" | "normal";
    disabled?: boolean;
};

const RoundedButton: React.FC<RoundedButtonProps> = ({
    onPress,
    text,
    size = "medium",
    variant = "primary",
    iconName,
    iconSize = 30,
    iconColor = "#fff",
    iconType = IconType.Ionicon,
    style,
    textColor,
    textWeight = "normal",
    disabled = false,
}) => {
    const styles = RoundedButtonStyles();
    let textStyle: StyleProp<TextStyle>;

    let buttonStyles: StyleProp<ViewStyle> = [styles.roundedButton, styles[variant]];

    switch (variant) {
        case "muted":
            buttonStyles = [buttonStyles, styles.muted];
            textStyle = [styles.text, { color: textColor || LightTheme.colors.primary }];
            break;
        case "primary":
            buttonStyles = [buttonStyles, styles.primary];
            textStyle = [styles.text, { color: textColor || LightTheme.colors.white }];
            break;
        case "secondary":
            buttonStyles = [buttonStyles, styles.secondary];
            textStyle = [styles.text, { color: textColor || LightTheme.colors.white }];
            break;
        case "link":
            buttonStyles = [buttonStyles, styles.link];
            textStyle = [styles.text, { color: textColor || LightTheme.colors.white }];
            break;
        default:
            textStyle = [styles.text, { color: textColor }];
            break;
    }

    if (size === "small") {
        buttonStyles = [buttonStyles, styles.small];
    } else if (size === "large") {
        buttonStyles = [buttonStyles, styles.large];
    }

    if (text) {
        buttonStyles = [buttonStyles, styles.textButton];
    }

    textStyle = [textStyle, { fontFamily: textWeight === "bold" ? "PoppinsSemiBold" : "PoppinsRegular" }];

    return (
        <TouchableOpacity style={[buttonStyles, style]} onPress={onPress} disabled={disabled}>
            <View style={styles.contentContainer}>
                {iconName && (
                    <CustomIcons
                        icon={{
                            value: { type: iconType, name: iconName as any },
                            size: iconSize,
                            color: iconColor,
                        }}
                    />
                )}
                {text && <Text style={[textStyle]}>{text}</Text>}
            </View>
        </TouchableOpacity>
    );
};

export default RoundedButton;
