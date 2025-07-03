import React from "react";
import { Text, View } from "react-native";
import ErrorHolderStyles from "@/src/components/common/errorHolder/ErrorHolderStyles";
import CustomIcons, { IconType } from "@/src/components/icons/CustomIcons";
import LightTheme from "@/src/theme/LightTheme";

interface ErrorHolderProps {
    errorMessage: string;
}

const ErrorHolder: React.FC<ErrorHolderProps> = ({ errorMessage }) => {
    const styles = ErrorHolderStyles();

    return (
        <View style={styles.container}>
            <CustomIcons
                icon={{
                    value: { type: IconType.FontAwesomeIcon, name: "exclamation-circle" },
                    size: 14,
                    color: LightTheme.colors.error,
                }}
            />
            <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
    );
};

export default ErrorHolder;
