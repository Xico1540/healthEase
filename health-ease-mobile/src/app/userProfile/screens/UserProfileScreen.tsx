import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { isNil } from "lodash";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Patient, Practitioner } from "fhir/r4";
import { rgba } from "polished";
import UserProfileShowView from "@/src/app/userProfile/components/views/UserProfileShowView";
import UserProfileEditView from "@/src/app/userProfile/components/views/UserProfileEditView";
import UserController from "@/src/controllers/fhir/UserController";
import UserProfileHeader from "@/src/app/userProfile/components/UserProfileHeader";
import { useCustomAlert } from "@/src/components/customAlert/CustomAlertProvider";
import RouteHeader from "@/src/components/common/header/RouteHeader";
import { compareObjects } from "@/src/utils/utils";
import RoundedButton from "@/src/components/buttons/RoundedButton/RoundedButton";
import { useAuth } from "@/src/context/AuthProviderContext";
import { ImageDetails, PatientUserData } from "@/src/model/PatientUserData";
import CommonStyles from "@/src/app/CommonStyles";
import { IconType } from "@/src/components/icons/CustomIcons";
import UserService from "@/src/services/UserService";
import LightTheme from "@/src/theme/LightTheme";
import { PractitionerUserData } from "@/src/model/PractitionerUserData";

const UserProfileScreen = () => {
    const commonStyles = CommonStyles();
    const [editViewVisible, setEditViewVisible] = useState(false);
    const { showAlert } = useCustomAlert();
    const [profileImage, setProfileImage] = useState<ImageDetails[]>([]);
    const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        reset,
        watch,
        formState: { errors }
    } = useForm<PractitionerUserData>();
    const currentValues = getValues();
    const watchValues = watch();
    const { userDetails, setUserDetails, isPatient } = useAuth();
    const fixedHeaderWrapperRef = useRef<View>(null);
    const [initialValues, setInitialValues] = useState<PatientUserData | null>(null);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const userService = UserService.getInstance();

    useEffect(() => {
        (async () => {
            if (!isNil(userDetails)) {
                const transformedData = UserController.transformShow(userDetails);
                reset(transformedData);
                setInitialValues(transformedData as PatientUserData);
            }
        })();
    }, [reset, userDetails]);

    useEffect(() => {
        setIsFormChanged(!compareObjects(initialValues, currentValues));
    }, [watchValues, currentValues]);

    const handleEditProfile = () => {
        if (!editViewVisible) {
            setEditViewVisible(!editViewVisible);
        }
    };

    const handleFormSubmit = async (data: PatientUserData) => {
        const madeChanges = await showAlert({
            title: "Editar Perfil",
            message: "Deseja guardar as alterações?",
            buttons: ["yes", "no"],
            type: "dialog"
        });
        if (madeChanges) {
            if (!isNil(userDetails)) {
                const user: Patient | Practitioner = UserController.transformEdit(userDetails, data);
                userService.updateUser(user).then(
                    () => {
                        setUserDetails(user);
                        setEditViewVisible(false);
                        showAlert({
                            title: "Sucesso",
                            message: "Perfil atualizado com sucesso",
                            type: "success"
                        });
                        scrollViewRef.current?.scrollToPosition(0, 0, true);
                    },
                    () => {
                        showAlert({
                            title: "Erro",
                            message: "Erro ao atualizar o perfil",
                            type: "error"
                        });
                    }
                );
            }
        }
    };

    const handleFormSubmitWrapper = (data: PatientUserData) => async () => {
        await handleFormSubmit(data);
    };

    return (
        <View style={commonStyles.container}>
            <View ref={fixedHeaderWrapperRef} style={commonStyles.fixedHeaderWrapper}>
                <View
                    style={{
                        backgroundColor: LightTheme.colors.primary,
                        paddingBottom: 10,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20
                    }}
                >
                    <RouteHeader
                        title={editViewVisible ? "Editar Perfil" : "Perfil"}
                        rightSideComponent={
                            <RoundedButton
                                onPress={editViewVisible ? handleFormSubmitWrapper(getValues()) : handleEditProfile}
                                size="medium"
                                iconColor="white"
                                iconName={editViewVisible ? "check" : "edit-3"}
                                iconSize={22}
                                iconType={IconType.featherIcon}
                                disabled={editViewVisible && !isFormChanged}
                                style={{
                                    backgroundColor: rgba(LightTheme.colors.white, 0.15)
                                }}
                            />
                        }
                        previousTitle={editViewVisible ? "Perfil" : "Home"}
                    />
                </View>

            </View>
            <KeyboardAwareScrollView
                scrollEnabled
                shouldRasterizeIOS
                keyboardOpeningTime={0}
                contentContainerStyle={{
                    flexGrow: 1
                }}
                extraScrollHeight={15}
                ref={scrollViewRef}
                style={commonStyles.scrollViewContainer}
                bounces={false}>
                <View style={commonStyles.scrollContent}>
                    <UserProfileHeader
                        control={control}
                        setValue={setValue}
                        getValues={getValues}
                        isEditView={editViewVisible}
                        profileImage={profileImage}
                        setProfileImage={setProfileImage}
                        styles={{ paddingTop: 60 }}
                    />
                    <View style={commonStyles.mainContent}>
                        {editViewVisible ? (
                            <UserProfileEditView
                                control={control}
                                handleSubmit={handleSubmit}
                                errors={errors}
                                setValue={setValue}
                                getValues={getValues}
                                isFormChanged={isFormChanged}
                                handleFormSubmit={handleFormSubmit}
                                isPatient={isPatient}
                            />
                        ) : (
                            <UserProfileShowView control={control} getValues={getValues} isPatient={isPatient} />
                        )}
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default UserProfileScreen;
