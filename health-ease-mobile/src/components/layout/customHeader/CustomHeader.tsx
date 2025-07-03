import React from "react";
import { Text, View } from "react-native";
import CreateCustomHeaderStyles from "@/src/components/layout/customHeader/CustomHeaderStyle";

export interface CustomHeaderProps {
    name: string;
}

const CustomHeader = ({ name }: CustomHeaderProps) => {
    const styles = CreateCustomHeaderStyles();

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, color: "red" }}>{name}</Text>
        </View>
    );
};

export default CustomHeader;
