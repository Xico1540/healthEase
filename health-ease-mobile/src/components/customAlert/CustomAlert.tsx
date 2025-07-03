import React, { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CreateModalAlertStyles from "@/src/components/customAlert/CustomAlertStyles";
import NamedStyles = StyleSheet.NamedStyles;
import LightTheme from "@/src/theme/LightTheme";

export type CustomAlertTypes = "success" | "error" | "dialog";
export type CustomAlertButtons = "yes" | "no" | "cancel";

export type CustomAlertProps = {
    type: CustomAlertTypes;
    isVisible: boolean;
    title: string;
    message: string | React.ReactNode;
    buttons?: CustomAlertButtons[];
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
};

const AdditionalContentContainer: React.FC<{
    children: React.ReactNode;
    style: NamedStyles<any>;
    content: "buttons" | "text";
}> = ({ children, style, content }) => {
    const flexDirection = content === "buttons" ? "row" : "column";
    return <View style={{ ...style.additionalContentContainer, flexDirection }}>{children}</View>;
};

const IconContainer: React.FC<{ name: string; style: any }> = ({ name, style }) => (
    <View style={style.iconContainer}>
        <Ionicons name={name as any} style={[style.icon, style.iconSpecific]} />
    </View>
);

const TextContainer: React.FC<{ title: string; message: React.ReactNode; style: any }> = ({
    title,
    message,
    style,
}) => (
    <View style={style.textContainer}>
        <Text style={[style.titleText, style.titleSpecific]}>{title}</Text>
        {typeof message === "string" ? <Text style={style.messageText}>{message}</Text> : message}
    </View>
);

const SuccessContent: React.FC<{ title: string; message: string | React.ReactNode; colorVariant: string }> = ({
    title,
    message,
    colorVariant,
}) => {
    const { commonStyles } = CreateModalAlertStyles();
    return (
        <>
            <IconContainer name="checkmark-circle" style={{ ...commonStyles, iconSpecific: { color: colorVariant } }} />
            <TextContainer
                title={title}
                message={message}
                style={{ ...commonStyles, titleSpecific: { color: colorVariant } }}
            />
        </>
    );
};

const ErrorContent: React.FC<{
    title: string;
    message: string | React.ReactNode;
    colorVariant: string;
}> = ({ title, message, colorVariant }) => {
    const { commonStyles } = CreateModalAlertStyles();
    return (
        <>
            <IconContainer name="close-circle" style={{ ...commonStyles, iconSpecific: { color: colorVariant } }} />
            <TextContainer
                title={title}
                message={message}
                style={{ ...commonStyles, titleSpecific: { color: colorVariant } }}
            />
            <AdditionalContentContainer style={commonStyles} content="text">
                <Text style={commonStyles.helperErrorText}>
                    Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.
                </Text>
            </AdditionalContentContainer>
        </>
    );
};

const DialogContent: React.FC<{
    title: string;
    message: string | React.ReactNode;
    buttons: CustomAlertButtons[];
    colorVariant: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    close: () => void;
}> = ({ title, message, buttons, colorVariant, onConfirm, onCancel, close }) => {
    const { commonStyles } = CreateModalAlertStyles();

    return (
        <>
            <IconContainer name="help-circle" style={{ ...commonStyles, iconSpecific: { color: colorVariant } }} />
            <TextContainer
                title={title}
                message={message}
                style={{ ...commonStyles, titleSpecific: { color: colorVariant } }}
            />
            <AdditionalContentContainer style={commonStyles} content="buttons">
                {buttons.includes("yes") && (
                    <TouchableOpacity
                        style={[commonStyles.button, commonStyles.confirmButton]}
                        onPress={() => {
                            if (onConfirm) onConfirm();
                            close();
                        }}>
                        <Text testID="yesButton" style={commonStyles.confirmButtonText}>
                            Sim
                        </Text>
                    </TouchableOpacity>
                )}
                {buttons.includes("no") && (
                    <TouchableOpacity
                        style={[commonStyles.button, commonStyles.cancelButton]}
                        onPress={() => {
                            if (onCancel) onCancel();
                            close();
                        }}>
                        <Text testID="noButton" style={commonStyles.cancelButtonText}>
                            Não
                        </Text>
                    </TouchableOpacity>
                )}
                {buttons.includes("cancel") && (
                    <TouchableOpacity
                        testID="cancelButton"
                        style={[commonStyles.button, commonStyles.cancelButton]}
                        onPress={() => {
                            if (onCancel) onCancel();
                            close();
                        }}>
                        <Text style={commonStyles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
            </AdditionalContentContainer>
        </>
    );
};

const CustomAlert: React.FC<CustomAlertProps> = ({
    type,
    isVisible,
    title,
    message,
    buttons = ["yes", "cancel"],
    onClose,
    onConfirm,
    onCancel,
}) => {
    const [isModalVisible, setModalVisible] = useState(isVisible);
    const { commonStyles, alertStyles, dialogStyles } = CreateModalAlertStyles();

    const close = useCallback(() => {
        setModalVisible(false);
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        setModalVisible(isVisible);
    }, [isVisible]);

    const renderContent = () => {
        switch (type) {
            case "success":
                return <SuccessContent title={title} message={message} colorVariant={LightTheme.colors.success} />;
            case "error":
                return <ErrorContent title={title} message={message} colorVariant={LightTheme.colors.error} />;
            case "dialog":
                return (
                    <DialogContent
                        title={title}
                        message={message}
                        buttons={buttons}
                        colorVariant={LightTheme.colors.info}
                        onConfirm={onConfirm}
                        onCancel={onCancel}
                        close={close}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Modal
            transparent
            statusBarTranslucent
            visible={isModalVisible}
            supportedOrientations={["portrait", "landscape"]}
            animationType="slide"
            onRequestClose={type === "dialog" ? undefined : close}>
            <Pressable
                testID="modalBackdrop"
                style={commonStyles.backdrop}
                onPress={type === "dialog" ? undefined : close}>
                <View style={commonStyles.modalContainer}>
                    <Pressable
                        style={[type === "dialog" ? dialogStyles.contentContainer : alertStyles.contentContainer]}>
                        {renderContent()}
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    );
};

export default CustomAlert;
