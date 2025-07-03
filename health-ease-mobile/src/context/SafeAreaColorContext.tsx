import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import LightTheme from "@/src/theme/LightTheme";

interface SafeAreaColorContextProps {
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
}

const createSafeAreaColorContext = createContext<SafeAreaColorContextProps | undefined>(undefined);

export const SafeAreaColorContext = ({ children }: { children: ReactNode }) => {
    const [backgroundColor, setBackgroundColor] = useState<string>(LightTheme.colors.primary);

    const value = useMemo(() => ({ backgroundColor, setBackgroundColor }), [backgroundColor, setBackgroundColor]);

    return <createSafeAreaColorContext.Provider value={value}>{children}</createSafeAreaColorContext.Provider>;
};

export const useSafeAreaColorContext = (): SafeAreaColorContextProps => {
    const context = useContext(createSafeAreaColorContext);
    if (!context) {
        throw new Error("useBackgroundColor must be used within a BackgroundColorProvider");
    }
    return context;
};
