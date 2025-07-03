import { Text, View } from "react-native";
import React from "react";
import FixedHeaderStyles from "@/src/components/common/header/FixedHeaderStyles";

interface FixedHeaderProps {
    title?: string;
    roundedBottomCorners?: boolean;
    rightSideComponent?: React.ReactNode;
    leftSideComponent?: React.ReactNode;
}

const FixedHeader = ({
    title,
    rightSideComponent,
    leftSideComponent,
    roundedBottomCorners = true,
}: FixedHeaderProps) => {
    const styles = FixedHeaderStyles(roundedBottomCorners);

    return (
        <View style={styles.fixedHeader}>
            <View style={styles.actionButtonsContainer}>
                {leftSideComponent && <View style={styles.leftButtonPlaceholder}>{leftSideComponent}</View>}
                {title && <Text style={styles.titleText}>{title}</Text>}
                {rightSideComponent && <View style={styles.rightButtonPlaceholder}>{rightSideComponent}</View>}
            </View>
        </View>
    );
};

export default FixedHeader;
