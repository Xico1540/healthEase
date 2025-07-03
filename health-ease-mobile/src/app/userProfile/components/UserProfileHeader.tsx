import React, { useCallback, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { Control, Controller, FieldPath, FieldPathValue, SetValueConfig, UseFormGetValues } from "react-hook-form";
import { isEmpty } from "lodash";
import { SheetManager } from "react-native-actions-sheet";
import UserProfileStyles from "@/src/app/userProfile/styles/UserProfileStyles";
import GenericUserImage from "@/src/assets/images/generic_user_image.jpg";
import { ImageDetails } from "@/src/model/PatientUserData";
import LightTheme from "@/src/theme/LightTheme";
import CustomIcons, { IconType } from "@/src/components/icons/CustomIcons";
import { pickImage } from "@/src/utils/utils";
import { PractitionerUserData } from "@/src/model/PractitionerUserData";

interface UserProfileHeaderProps {
    isEditView: boolean;
    control: Control<PractitionerUserData, any>;
    setValue: (
        name: FieldPath<PractitionerUserData>,
        value: FieldPathValue<PractitionerUserData, any>,
        config?: SetValueConfig,
    ) => void;
    getValues: UseFormGetValues<PractitionerUserData>;
    profileImage: ImageDetails[];
    setProfileImage: React.Dispatch<React.SetStateAction<ImageDetails[]>>;
    styles?: any;
}

const getImageSource = (profileImage: ImageDetails[], value: ImageDetails[] | undefined) => {
    if (!isEmpty(profileImage) && profileImage[0].uri) {
        return { uri: profileImage[0].uri };
    }
    if (!isEmpty(profileImage) && profileImage[0].base64) {
        return { uri: profileImage[0].base64 };
    }
    if (!isEmpty(value) && value?.[0].base64) {
        return { uri: value[0].base64 };
    }
    if (!isEmpty(value) && value?.[0].uri) {
        return { uri: value[0].uri };
    }
    return GenericUserImage;
};

const UserProfileHeader = ({
    isEditView,
    control,
    setValue,
    getValues,
    profileImage,
    setProfileImage,
    styles,
}: UserProfileHeaderProps) => {
    const userProfileStyles = UserProfileStyles();
    const [isModalVisible, setModalVisible] = useState(false);

    const openUploadOptions = useCallback(async () => {
        await SheetManager.show("image-picker-options", {
            payload: {
                onPickImage: (source) =>
                    pickImage(source, profileImage, setProfileImage, setValue, "personalInformation.photo", 1, false),
            },
        });
    }, [profileImage, setProfileImage, setValue]);

    const removeImage = () => {
        setProfileImage([]);
        setValue("personalInformation.photo", []);
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <View style={[userProfileStyles.dynamicHeader, styles, { backgroundColor: LightTheme.colors.primary }]}>
            <View style={userProfileStyles.userProfileContainer}>
                <View style={userProfileStyles.imageWrapper}>
                    <TouchableOpacity onPress={toggleModal} disabled={isEditView}>
                        <Controller
                            control={control}
                            name="personalInformation.photo"
                            render={({ field: { value } }) => (
                                <Image
                                    source={getImageSource(profileImage, value)}
                                    style={userProfileStyles.profileImage}
                                />
                            )}
                        />
                    </TouchableOpacity>
                    {isEditView && (
                        <>
                            {!isEmpty(profileImage) || !isEmpty(getValues("personalInformation.photo")) ? (
                                <TouchableOpacity style={userProfileStyles.removeIcon} onPress={removeImage}>
                                    <CustomIcons
                                        icon={{
                                            value: { type: IconType.Ionicon, name: "close" },
                                            size: 25,
                                            color: LightTheme.colors.white,
                                        }}
                                    />
                                </TouchableOpacity>
                            ) : null}

                            <TouchableOpacity style={userProfileStyles.editIcon} onPress={openUploadOptions}>
                                <CustomIcons
                                    icon={{
                                        value:
                                            !isEmpty(profileImage) || !isEmpty(getValues("personalInformation.photo"))
                                                ? { type: IconType.featherIcon, name: "edit-2" }
                                                : { type: IconType.featherIcon, name: "plus" },
                                        size: 17,
                                        color: LightTheme.colors.secondary,
                                    }}
                                />
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <Controller
                    control={control}
                    name="personalInformation.firstName"
                    render={({ field: { value: firstName } }) => (
                        <Controller
                            control={control}
                            name="personalInformation.lastName"
                            render={({ field: { value: lastName } }) => (
                                <Text style={userProfileStyles.titleText}>
                                    {firstName} {lastName}
                                </Text>
                            )}
                        />
                    )}
                />
            </View>

            <Modal visible={isModalVisible} statusBarTranslucent transparent animationType="fade">
                <View style={userProfileStyles.modalContainer}>
                    <TouchableOpacity style={userProfileStyles.modalBackground} onPress={toggleModal}>
                        <Controller
                            control={control}
                            name="personalInformation.photo"
                            render={({ field: { value } }) => (
                                <Image
                                    source={getImageSource(profileImage, value)}
                                    style={userProfileStyles.modalImage}
                                />
                            )}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

export default UserProfileHeader;
