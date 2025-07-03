import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { parseToRgb, rgba } from "polished";
import LightTheme from "@/src/theme/LightTheme";
import { IconType } from "@/src/components/icons/CustomIcons";
import RouteHeaderStyles from "@/src/components/headers/routeHeader/RouteHeaderStyles";
import { useSafeAreaColorContext } from "@/src/context/SafeAreaColorContext";
import RoundedButton from "@/src/components/buttons/RoundedButton/RoundedButton";

interface FixedHeaderProps {
    title?: string;
    goBack?: boolean;
    onGoBack?: () => void;
    rightSideComponent?: React.ReactNode;
    roundedBottomCorners?: boolean;
    previousTitle?: string;
}

const RouteHeader = ({
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

    const { setBackgroundColor } = useSafeAreaColorContext();

    useEffect(() => {
        if (previousTitle) {
            const previousTitleWidth = previousTitle.length * 10;
            setShouldHidePreviousTitle(previousTitleWidth > screenWidth * 0.2);
        }
    }, [title, previousTitle, screenWidth]);

    useEffect(() => {
        setBackgroundColor(LightTheme.colors.primary);
    }, []);

    return (
        <SafeAreaView style={[styles.fixedHeader]}>
            <View style={styles.actionButtonsContainer}>
                {goBack && (
                    <RoundedButton
                        onPress={() => (onGoBack ? onGoBack() : navigation.goBack())}
                        size="medium"
                        variant="muted"
                        iconName="chevron-left"
                        iconColor={LightTheme.colors.white}
                        textColor={LightTheme.colors.white}
                        iconType={IconType.featherIcon}
                        text={previousTitle}
                        style={{
                            alignSelf: "flex-start",
                            backgroundColor: rgba({
                                ...parseToRgb(LightTheme.colors.white),
                                alpha: 0.1,
                            }),
                        }}
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
        </SafeAreaView>
    );
};

export default RouteHeader;
