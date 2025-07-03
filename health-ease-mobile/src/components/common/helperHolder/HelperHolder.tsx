import React from "react";
import { Text, View } from "react-native";
import HelperHolderStyles from "@/src/components/common/helperHolder/HelperHolderStyles";
import CustomIcons, { IconType } from "@/src/components/icons/CustomIcons";
import LightTheme from "@/src/theme/LightTheme";

interface ErrorHolderProps {
    helperMessage: string | React.ReactNode;
    onPress?: () => void;
    style?: any;
}

const HelperHolder: React.FC<ErrorHolderProps> = ({ helperMessage, onPress, style }) => {
    const styles = HelperHolderStyles();
    return (
        <View style={[styles.container, style]}>
            <CustomIcons
                icon={{
                    value: { type: IconType.FontAwesomeIcon, name: "info-circle" },
                    size: 12,
                    color: LightTheme.colors.primary,
                }}
            />
            {typeof helperMessage === "string" ? (
                <Text onPress={onPress} style={styles.messageText}>
                    {helperMessage}
                </Text>
            ) : (
                helperMessage
            )}
        </View>
    );
};

export default HelperHolder;
