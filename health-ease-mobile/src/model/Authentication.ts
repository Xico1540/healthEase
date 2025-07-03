import { Patient } from "fhir/r4";

export type AuthenticationLogin = {
    email: string;
    password: string;
    isClient?: boolean;
};

export type RecoverPassword = {
    email: string;
};

export type RefreshToken = {
    accessToken: string;
    refreshToken: string;
};

export enum AuthContextEnum {
    USER = "User",
    CLIENT = "Client",
    NO_AUTH = "NoAuth",
}

export interface AuthContextProps {
    checkAuthentication: (AuthContext: AuthContextEnum) => Promise<void>;
    role: string | null;
    setRole: (permissions: string | null) => void;
    userAttributes: { [key: string]: string } | null;
    setUserAttributes: (attributes: { [key: string]: string } | null) => void;

    userPatientResource: Patient | null;
    setUserPatientResource: (userData: Patient | null) => void;

    recoverPassword: (email: string, setLoading: (value: boolean) => void) => Promise<void>;
    isUserAuthenticated: boolean;

    login: (
        authContext: AuthContextEnum,
        data?: AuthenticationLogin,
        setLoading?: (value: boolean) => void,
    ) => Promise<void>;
    logout: () => void;
}
