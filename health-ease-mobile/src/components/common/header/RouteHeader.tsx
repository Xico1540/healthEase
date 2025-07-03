import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import RouteHeaderStyles from "@/src/components/common/header/RouteHeaderStyles";
import RoundedButton from "@/src/components/buttons/RoundedButton/RoundedButton";
import LightTheme from "@/src/theme/LightTheme";
import { IconType } from "@/src/components/icons/CustomIcons";

interface FixedHeaderProps {
    title?: string;
    goBack?: boolean;
    onGoBack?: () => void;
    rightSideComponent?: React.ReactNode;
    roundedBottomCorners?: boolean;
    previousTitle?: string;
}

const FixedHeader = ({
    title,
    goBack = false,
    rightSideComponent,
    roundedBottomCorners = true,
    previousTitle,
    onGoBack,
}: FixedHeaderProps) => {
    const styles = RouteHeaderStyles(roundedBottomCorners);
    const navigation = useNavigation();
    const screenWidth = Dimensions.get("window").width;
    const [shouldHidePreviousTitle, setShouldHidePreviousTitle] = useState(false);

    useEffect(() => {
        if (previousTitle) {
            const previousTitleWidth = previousTitle.length * 10;
            setShouldHidePreviousTitle(previousTitleWidth > screenWidth * 0.2);
        }
    }, [title, previousTitle, screenWidth]);

    return (
        <View style={styles.actionButtonsContainer}>
            {goBack && (
                <RoundedButton
                    onPress={() => (onGoBack ? onGoBack() : navigation.goBack())}
                    size="medium"
                    variant="secondary"
                    iconName="chevron-left"
                    iconColor={LightTheme.colors.white}
                    textColor={LightTheme.colors.white}
                    iconType={IconType.featherIcon}
                    text={previousTitle}
                />
            )}
            {!shouldHidePreviousTitle && title && (
                <View
                    style={[
                        styles.titleContainer,
                        {
                            position: "absolute",
                            left: 0,
                            right: 0,
                            alignItems: "center",
                        },
                    ]}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>
            )}
            <View style={[styles.rightButtonPlaceholder, { marginLeft: "auto", alignItems: "flex-end" }]}>
                {rightSideComponent || <View style={{ width: 50 }} />}
            </View>
        </View>
    );
};

export default FixedHeader;
