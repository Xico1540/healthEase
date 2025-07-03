import React from "react";
import { View } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";

export enum IconType {
    MaterialIcon,
    FontAwesomeIcon,
    Ionicon,
    featherIcon,
}

export type IconValue =
    | { type: IconType.MaterialIcon; name: keyof typeof MaterialIcons.glyphMap }
    | { type: IconType.FontAwesomeIcon; name: keyof typeof FontAwesome.glyphMap }
    | { type: IconType.Ionicon; name: keyof typeof Ionicons.glyphMap }
    | { type: IconType.featherIcon; name: keyof typeof Feather.glyphMap };

export type CustomProps = {
    icon: {
        value: IconValue;
        size: number;
        color?: string;
    };
};

const CustomComponent: React.FC<CustomProps> = (props) => {
    const { icon } = props;

    return (
        <View>
            {icon.value.type === IconType.FontAwesomeIcon && (
                <FontAwesome name={icon.value.name} size={icon.size} color={icon.color} />
            )}
            {icon.value.type === IconType.MaterialIcon && (
                <MaterialIcons name={icon.value.name} size={icon.size} color={icon.color} />
            )}
            {icon.value.type === IconType.Ionicon && (
                <Ionicons name={icon.value.name} size={icon.size} color={icon.color} />
            )}
            {icon.value.type === IconType.featherIcon && (
                <Feather name={icon.value.name} size={icon.size} color={icon.color} />
            )}
        </View>
    );
};

export default CustomComponent;
