import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import CustomAlert, { CustomAlertProps } from "@/src/components/customAlert/CustomAlert";

type ModalContextType = {
    showAlert: (props: Omit<CustomAlertProps, "isVisible">) => Promise<boolean | void>;
    hideAlert: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const CustomAlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modalProps, setModalProps] = useState<CustomAlertProps | undefined>(undefined);

    const hideAlert = useCallback(() => {
        setModalProps((prevState) => (prevState ? { ...prevState, isVisible: false } : undefined));
    }, []);

    const showAlert = useCallback(
        (props: Omit<CustomAlertProps, "isVisible">) =>
            new Promise<boolean | void>((resolve) => {
                if (props.type === "dialog") {
                    setModalProps({
                        ...props,
                        isVisible: true,
                        onConfirm: () => {
                            resolve(true);
                            hideAlert();
                        },
                        onCancel: () => {
                            resolve(false);
                            hideAlert();
                        },
                    });
                } else {
                    setModalProps({
                        ...props,
                        isVisible: true,
                        onClose: () => {
                            resolve();
                            hideAlert();
                        },
                    });
                }
            }),
        [hideAlert],
    );

    const providerValue = useMemo(
        () => ({
            showAlert,
            hideAlert,
        }),
        [showAlert, hideAlert],
    );

    return (
        <ModalContext.Provider value={providerValue}>
            {children}
            {modalProps && (
                <CustomAlert
                    type={modalProps.type}
                    isVisible={modalProps.isVisible}
                    title={modalProps.title}
                    message={modalProps.message}
                    buttons={modalProps.buttons}
                    onClose={modalProps.onClose}
                    onConfirm={modalProps.onConfirm}
                    onCancel={modalProps.onCancel}
                />
            )}
        </ModalContext.Provider>
    );
};

export const useCustomAlert = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useCustomAlert must be used within a CustomAlertProvider");
    }
    return context;
};
