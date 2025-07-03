import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DefaultHeaderStyles from "./DefaultHeaderStyles";
import CustomIcons, { IconType } from "@/src/components/icons/CustomIcons";

interface DefaultHeaderProps {
    title: string;
}

const DefaultHeader: React.FC<DefaultHeaderProps> = ({ title }) => {
    const styles = DefaultHeaderStyles;

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.iconButton}>
                <CustomIcons
                    icon={{ value: { type: IconType.FontAwesomeIcon, name: "arrow-left" }, size: 24, color: "white" }}
                />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity style={styles.iconButton}>
                <CustomIcons
                    icon={{ value: { type: IconType.FontAwesomeIcon, name: "pencil" }, size: 20, color: "white" }}
                />
            </TouchableOpacity>
        </View>
    );
};

export default DefaultHeader;
