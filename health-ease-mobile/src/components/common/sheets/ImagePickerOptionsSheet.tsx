import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { PermissionStatus, useCameraPermissions } from "expo-camera";
import ImagePickerOptionsSheetStyles from "@/src/components/common/sheets/ImagePickerOptionsSheetStyles";
import { useCustomAlert } from "@/src/components/customAlert/CustomAlertProvider";
import LightTheme from "@/src/theme/LightTheme";
import CustomIcons, { IconType } from "@/src/components/icons/CustomIcons";

export const ImagePickerOptionsSheet = ({ payload }: SheetProps<"image-picker-options">) => {
    const styles = ImagePickerOptionsSheetStyles();
    const [permission, requestPermission] = useCameraPermissions();
    const { showAlert } = useCustomAlert();

    const handleCameraPress = async () => {
        if (permission?.status === PermissionStatus.UNDETERMINED || permission?.status === PermissionStatus.DENIED) {
            const result = await requestPermission();
            if (result.status !== PermissionStatus.GRANTED) {
                SheetManager.hide("image-picker-options").then(() => {
                    showAlert({
                        title: "Permissão de câmera negada",
                        message:
                            "O acesso à câmara é necessário para tirar fotografias. Por favor, ative as permissões da câmara nas definições do seu dispositivo.",
                        buttons: ["cancel"],
                        type: "dialog",
                    });
                });
                return;
            }
        }
        payload?.onPickImage("camera");
    };

    return (
        <ActionSheet
            id="image-picker-options"
            snapPoints={[23]}
            containerStyle={{ flex: 1, backgroundColor: LightTheme.colors.background }}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={() => payload?.onPickImage("library")}>
                    <CustomIcons
                        icon={{
                            value: { type: IconType.Ionicon, name: "images-outline" },
                            size: 24,
                            color: LightTheme.colors.primary,
                        }}
                    />
                    <Text style={styles.buttonText}>Galeria</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
                    <CustomIcons
                        icon={{
                            value: { type: IconType.Ionicon, name: "camera-outline" },
                            size: 24,
                            color: LightTheme.colors.primary,
                        }}
                    />
                    <Text style={styles.buttonText}>Câmara</Text>
                </TouchableOpacity>
            </View>
        </ActionSheet>
    );
};

export default ImagePickerOptionsSheet;
