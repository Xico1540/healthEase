import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SwitchButtonsStyles from "@/src/components/buttons/SwitchButton/SwitchButtonsStyles";

interface SwitchButtonProps {
    options: string[];
    selectedOption?: string;
    onSelect: (option: string) => void;
    editable?: boolean;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({ options, selectedOption, onSelect, editable = true }) => {
    const styles = SwitchButtonsStyles();

    return (
        <View style={styles.horizontalContainer}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={[styles.button, selectedOption === option && styles.buttonSelected]}
                    onPress={() => onSelect(option)}
                    disabled={!editable}>
                    <Text style={[styles.buttonText, selectedOption === option && styles.buttonTextSelected]}>
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default SwitchButton;
