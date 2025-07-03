import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { darken } from "polished";
import CreateStepLayoutStyles from "@/src/components/layout/stepLayout/StepLayoutStyles";
import RoundedButton from "@/src/components/buttons/RoundedButton/RoundedButton";
import LightTheme from "@/src/theme/LightTheme";
import { IconType } from "@/src/components/icons/CustomIcons";

type StepLayoutProps = {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    onSubmit?: () => void;
    children: React.ReactNode;
    contentStyle?: any;
    showFooter?: boolean;
    extraScrollHeight?: number;
};

const StepLayout: React.FC<StepLayoutProps> = ({
    currentStep,
    totalSteps,
    onNext,
    onBack,
    onSubmit,
    children,
    contentStyle,
    showFooter = true,
    extraScrollHeight = 0,
}) => {
    const styles = CreateStepLayoutStyles();
    return (
        <View style={{ flex: 1, backgroundColor: LightTheme.colors.white }}>
            <KeyboardAwareScrollView
                scrollEnabled
                shouldRasterizeIOS
                style={{ flex: 1 }}
                keyboardOpeningTime={0}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                extraScrollHeight={-55 + extraScrollHeight}>
                <View style={[styles.content, contentStyle]}>{children}</View>
            </KeyboardAwareScrollView>

            {showFooter && (
                <View style={styles.footer}>
                    {currentStep > 1 ? (
                        <RoundedButton
                            onPress={onBack}
                            size="medium"
                            iconName="chevron-left"
                            iconSize={30}
                            iconColor={LightTheme.colors.white}
                            style={{
                                backgroundColor: darken(0.2, LightTheme.colors.background),
                            }}
                            variant="muted"
                            iconType={IconType.featherIcon}
                        />
                    ) : (
                        <View style={styles.emptyButton} />
                    )}
                    <View style={styles.pagination}>
                        {Array.from({ length: totalSteps }).map((_, index: number) => (
                            <View
                                style={[styles.dot, currentStep === index + 1 ? styles.activeDot : {}]}
                                key={`page ${index + 1}`}
                            />
                        ))}
                    </View>
                    {currentStep < totalSteps ? (
                        <RoundedButton
                            onPress={onNext}
                            size="medium"
                            variant="primary"
                            iconName="chevron-right"
                            iconSize={30}
                            iconColor={LightTheme.colors.white}
                            iconType={IconType.featherIcon}
                        />
                    ) : (
                        <RoundedButton onPress={onSubmit} size="medium" variant="primary" text="Submeter" />
                    )}
                </View>
            )}
        </View>
    );
};

export default StepLayout;
