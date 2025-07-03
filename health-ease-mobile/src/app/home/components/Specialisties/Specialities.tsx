import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import SpecialitiesStyles from "@/src/app/home/components/Specialisties/SpecialitiesStyles";
import CustomIcons, { IconType } from "@/src/components/icons/CustomIcons";
import LightTheme from "@/src/theme/LightTheme";

interface SpecialitiesProps {
    setSpeciality: (speciality: string) => void;
}

const Specialities: React.FC<SpecialitiesProps> = ({ setSpeciality }) => {
    const [selectedSpeciality, setSelectedSpeciality] = useState<string | null>(null);
    const styles = SpecialitiesStyles();

    const tagsData = {
        tags: [
            { name: "Cardiologia", color: "#337DFF" },
            { name: "Dentista", color: "#15A59F" },
            { name: "Dermatologia", color: "#C52A5B" },
            { name: "Pediatria", color: "#777A12" },
            { name: "Neurologia", color: "#FF5733" },
            { name: "Oftalmologia", color: "#21812e" },
            { name: "Ortopedia", color: "#3357FF" },
            { name: "Psiquiatria", color: "#FF33A5" },
            { name: "Ginecologia", color: "#A533FF" },
            { name: "Endocrinologia", color: "#FF5733" },
            { name: "Gastroenterologia", color: "#2c6739" },
            { name: "Hematologia", color: "#3357FF" },
            { name: "Infectologia", color: "#FF33A5" },
            { name: "Nefrologia", color: "#A533FF" },
            { name: "Oncologia", color: "#203494" },
            { name: "Pneumologia", color: "#FF5733" },
            { name: "Reumatologia", color: "#0d751e" },
            { name: "Otorrinolaringologia", color: "#3357FF" },
            { name: "Nutrição", color: "#FF33A5" },
        ],
    };

    const handleSelectSpeciality = (speciality: string) => {
        if (selectedSpeciality === speciality) {
            setSelectedSpeciality(null);
            setSpeciality("");
        } else {
            setSelectedSpeciality(speciality);
            setSpeciality(speciality);
        }
    };

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.container}>
                {tagsData.tags.map((tag) => (
                    <TouchableOpacity key={tag.name} onPress={() => handleSelectSpeciality(tag.name)}>
                        <View
                            style={[
                                {
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderColor: tag.color,
                                },
                                styles.tag,
                            ]}>
                            <Text style={[{ color: tag.color }]}>{tag.name}</Text>
                            {selectedSpeciality === tag.name && (
                                <CustomIcons
                                    icon={{
                                        value: {
                                            type: IconType.featherIcon,
                                            name: "x",
                                        },
                                        size: 19,
                                        color: tag.color,
                                    }}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

export default Specialities;
