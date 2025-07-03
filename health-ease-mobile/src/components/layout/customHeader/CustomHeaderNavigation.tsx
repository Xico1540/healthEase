import React from "react";
import { StackNavigationOptions } from "@react-navigation/stack";
import { Text, View } from "react-native";
import CreateCustomHeaderStyles from "@/src/components/layout/customHeader/CustomHeaderStyle";
import LightTheme from "@/src/theme/LightTheme";
import { IconType } from "@/src/components/icons/CustomIcons";
import RoundedButton from "@/src/components/buttons/RoundedButton/RoundedButton";

interface CustomHeaderNavigationProps {
    title: string;
    navigation: any;
    handleGoBack?: (nav: any) => Promise<void>;
}

const CustomHeaderNavigation = ({ title }: CustomHeaderNavigationProps): StackNavigationOptions => {
    const styles = CreateCustomHeaderStyles();

    return {
        header: () => (
            <View style={{ height: 100 }}>
                <View>
                    <Text>TITLE</Text>
                    <Text>TITLE</Text>
                </View>
            </View>
        ),
    };
};

export default CustomHeaderNavigation;
