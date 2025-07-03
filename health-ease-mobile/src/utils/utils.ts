import { Linking } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Dispatch, SetStateAction } from "react";
import { ImageDetails, PatientUserData } from "@/src/model/PatientUserData";

export const compareObjects = (
    initialValues?: PatientUserData | null,
    currentValues?: PatientUserData | null,
): boolean => {
    const cleanObject = (obj: PatientUserData | undefined | null): any =>
        JSON.parse(
            JSON.stringify(obj, (key, value) => {
                if (typeof value === "string") {
                    return value.replace(/\s+/g, "");
                }
                if (key === "photo" && (value === undefined || (Array.isArray(value) && value.length === 0))) {
                    return undefined;
                }
                return value;
            }),
        );
    const cleanedInitialValues = cleanObject(initialValues);
    const cleanedCurrentValues = cleanObject(currentValues);
    return JSON.stringify(cleanedInitialValues) === JSON.stringify(cleanedCurrentValues);
};

export const openEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).then();
};

export const pickImage = async (
    source: "library" | "camera",
    images: ImageDetails[],
    setImages: Dispatch<SetStateAction<ImageDetails[]>>,
    setValue: any,
    controllerName: string,
    maxImages: number,
    allowMultipleSelection: boolean = true,
) => {
    let result;
    if (source === "library") {
        result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: !allowMultipleSelection,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: allowMultipleSelection,
            selectionLimit: maxImages === 1 ? maxImages : maxImages - images.length,
            quality: 1,
            base64: true,
        });
    } else {
        result = await ImagePicker.launchCameraAsync({
            allowsEditing: !allowMultipleSelection,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: allowMultipleSelection,
            base64: true,
            quality: 1,
        });
    }
    if (!result.canceled && result.assets) {
        await SheetManager.hide("image-picker-options");
        const newImages = await Promise.all(
            result.assets.map(async (asset) => {
                const manipulatedImage = await ImageManipulator.manipulateAsync(asset.uri, [], {
                    compress: 0.25,
                    format: ImageManipulator.SaveFormat.JPEG,
                    base64: true,
                });
                return {
                    uri: manipulatedImage.uri,
                    base64: manipulatedImage.base64,
                    fileName: asset.fileName,
                    mimeType: asset.mimeType,
                };
            }),
        );
        if (maxImages === 1) {
            setImages(newImages);
            setValue(controllerName, newImages);
        } else {
            setImages([...images, ...newImages]);
            setValue(controllerName, [...images, ...newImages]);
        }
    }
};
