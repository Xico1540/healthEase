import { StyleSheet } from "react-native";

export interface TitleStylesProps {
    titleContainer: object;
    title: object;
}

export const CustomTitleStyles = (): StyleSheet.NamedStyles<TitleStylesProps> =>
    StyleSheet.create({
        titleContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            gap: 10,
            alignSelf: "center",
            flexWrap: "wrap",
            justifyContent: "center",
        },
        title: {
            textAlign: "center",
            fontFamily: "PoppinsMedium",
        },
    });
