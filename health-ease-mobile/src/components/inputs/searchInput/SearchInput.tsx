import React, { useEffect, useRef } from "react";
import { Platform, TextInput, TouchableOpacity, View } from "react-native";
import SearchBarStyles from "./SearchBarStyles";
import CustomIcons, { IconType } from "@/src/components/icons/CustomIcons";
import LightTheme from "@/src/theme/LightTheme";

interface SearchBarProps {
    searchText: string;
    onSearchChange: (text: string) => void;
    onClearSearch: () => void;
}

const SearchInput: React.FC<SearchBarProps> = ({ searchText, onSearchChange, onClearSearch }) => {
    const styles = SearchBarStyles();
    const textInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (searchText === "") {
            textInputRef.current?.clear();
        }
    }, [searchText]);

    return (
        <View style={[styles.container]}>
            <CustomIcons
                icon={{
                    value: { type: IconType.featherIcon, name: "search" },
                    size: 20,
                    color: styles.icon.color,
                }}
            />
            <TextInput
                ref={textInputRef}
                placeholder="Procure pelo nome do profissional"
                value={searchText}
                onChangeText={onSearchChange}
                style={[styles.textInput, Platform.OS === "ios" && { marginVertical: 10 }]}
                placeholderTextColor={LightTheme.colors.white}
            />
            {searchText.length > 0 && (
                <TouchableOpacity onPress={onClearSearch}>
                    <CustomIcons
                        icon={{
                            value: { type: IconType.featherIcon, name: "x-circle" },
                            size: 20,
                            color: styles.icon.color,
                        }}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default SearchInput;
