import React from "react";
import { Text, TextStyle } from "react-native";
import LabelStyles from "@/src/components/common/label/LabelStyles";

interface LabelComponentProps {
    title: string;
    textColor?: string;
    textSize?: number;
    fontFamily?: string;
}

const Label: React.FC<LabelComponentProps> = ({ title, textColor, textSize, fontFamily }) => {
    const styles = LabelStyles();
    const conditionalStyles: TextStyle = {};

    if (textColor) {
        conditionalStyles.color = textColor;
    }
    if (textSize) {
        conditionalStyles.fontSize = textSize;
    }

    if (fontFamily) {
        conditionalStyles.fontFamily = fontFamily;
    }

    return <Text style={[styles.label, conditionalStyles]}>{title}</Text>;
};

export default Label;
