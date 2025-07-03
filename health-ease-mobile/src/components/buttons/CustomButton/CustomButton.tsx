import React from "react";
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import CustomIcons, { IconValue } from "@/src/components/icons/CustomIcons";
import CustomButtonStyles from "./CustomButtonStyles";
import LightTheme from "@/src/theme/LightTheme";

interface CustomButtonProps {
    title?: string;
    onPress: () => void;
    icon?: IconValue;
    outline?: boolean;
    buttonStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    variant?: "primary" | "secondary" | "link" | "muted";
    iconSize?: number;
    textColor?: string;
    textWeight?: "bold" | "normal";
    disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    icon = null,
    outline = false,
    buttonStyle,
    textStyle = { fontFamily: "PoppinsRegular" },
    variant = "primary",
    iconSize = 20,
    textColor,
    textWeight = "normal",
    disabled = false,
}) => {
    const styles = CustomButtonStyles();
    let buttonStyles: StyleProp<ViewStyle> = [styles.button, buttonStyle];
    let titleStyle: StyleProp<TextStyle> = [textStyle];
    let iconColor: string | undefined;

    switch (variant) {
        case "muted":
            buttonStyles = [buttonStyles, styles.muted];
            iconColor = textColor || LightTheme.colors.black;
            titleStyle = [titleStyle, { color: iconColor }];
            break;
        case "primary":
            buttonStyles = [buttonStyles, styles.primary];
            iconColor = textColor || LightTheme.colors.muted;
            titleStyle = [titleStyle, { color: iconColor }];
            break;
        case "secondary":
            buttonStyles = [buttonStyles, styles.secondary];
            iconColor = textColor || LightTheme.colors.white;
            titleStyle = [titleStyle, { color: iconColor }];
            break;
        case "link":
            buttonStyles = [buttonStyles, styles.link];
            iconColor = textColor || LightTheme.colors.white;
            titleStyle = [titleStyle, { color: iconColor }];
            break;
        default:
            iconColor = textColor;
            titleStyle = [titleStyle, { color: iconColor }];
            break;
    }

    titleStyle = [titleStyle, { fontFamily: textWeight === "bold" ? "PoppinsSemiBold" : "PoppinsRegular" }];

    return (
        <TouchableOpacity style={[buttonStyles, outline && styles.buttonOutline]} onPress={onPress} disabled={disabled}>
            {icon && (
                <CustomIcons
                    icon={{
                        value: icon,
                        size: iconSize,
                        color: iconColor,
                    }}
                />
            )}
            <Text style={titleStyle}>{title}</Text>
        </TouchableOpacity>
    );
};

export default CustomButton;
