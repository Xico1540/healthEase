import React, { createContext, ReactNode, useContext, useMemo, useState, useEffect } from "react";
import { StyleSheet, View, Animated, ActivityIndicator } from "react-native";

type LoadingContextType = {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    globalLoading: boolean;
    setGlobalLoading: (loading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    setLoading: () => {},
    globalLoading: false,
    setGlobalLoading: () => {},
});

type LoadingProviderProps = {
    children: ReactNode;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [globalLoading, setGlobalLoading] = useState<boolean>(false);
    const opacity = useMemo(() => new Animated.Value(0), []);

    useEffect(() => {
        if (globalLoading) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start();
        }
    }, [globalLoading, opacity]);

    const value = useMemo(
        () => ({
            isLoading,
            setLoading,
            globalLoading,
            setGlobalLoading,
        }),
        [isLoading, globalLoading],
    );

    return (
        <LoadingContext.Provider value={value}>
            <View style={styles.container}>
                <Animated.View
                    style={[styles.loadingOverlay, { opacity }]}
                    pointerEvents={globalLoading ? "auto" : "none"}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </Animated.View>
                {children}
            </View>
        </LoadingContext.Provider>
    );
};

export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};
