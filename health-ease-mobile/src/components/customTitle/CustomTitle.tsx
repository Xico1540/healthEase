import React from "react";
import { Text, View, ViewStyle } from "react-native";
import LightTheme from "@/src/theme/LightTheme";
import { CustomTitleStyles } from "@/src/components/customTitle/CustomTitleStyles";
import CustomIcons, { IconType } from "@/src/components/icons/CustomIcons";

interface TitleComponentProps {
    title: string;
    iconName?: string;
    iconType?: IconType;
    iconSize?: number;
    iconColor?: string;
    textColor?: string;
    textSize?: number;
    alignSelf?: "flex-start" | "center" | "flex-end";
    style?: ViewStyle;
}

const CustomTitle: React.FC<TitleComponentProps> = ({
    title,
    iconName,
    iconType,
    iconSize = 30,
    iconColor,
    textColor,
    textSize = 24,
    alignSelf,
    style,
}) => {
    const defaultColor = iconColor || LightTheme.colors.primary;
    const styles = CustomTitleStyles();

    const conditionalStyles: ViewStyle = {};

    if (alignSelf) {
        conditionalStyles.alignSelf = alignSelf;
    }

    return (
        <View style={[styles.titleContainer, conditionalStyles, style]}>
            {iconName && iconType && (
                <CustomIcons
                    icon={{
                        value: { type: iconType, name: iconName as any },
                        size: iconSize,
                        color: textColor ?? defaultColor,
                    }}
                />
            )}
            <Text style={[styles.title, { color: textColor ?? defaultColor, fontSize: textSize }]}>{title}</Text>
        </View>
    );
};

export default CustomTitle;
