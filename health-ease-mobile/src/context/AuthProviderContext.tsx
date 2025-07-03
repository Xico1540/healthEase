import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Patient, Practitioner } from "fhir/r4";
import { Alert } from "react-native";
import { logger } from "react-native-logs";
import AuthHttpClient from "@/src/http/AuthHttpClient";
import { AuthContextEnum, AuthenticationLogin } from "@/src/model/Authentication";
import ResourceDataProviderHttpClient from "@/src/http/ResourceDataProviderHttpClient";
import AllowedFhirTypes from "@/src/model/AllowedFhirTypes";
import decodeToken, { DecodedToken } from "@/src/utils/jwtUtils";
import AsyncStorageData from "@/src/model/AsyncStorageDataEnum";

interface AuthContextType {
    isAuthenticated: boolean;
    userDetails: Patient | Practitioner | undefined;
    setUserDetails: (value: Patient | Practitioner | undefined) => void;
    login: (setLoading: (value: boolean) => void, data: AuthenticationLogin) => Promise<void>;
    checkAuthentication: () => Promise<boolean>;
    isPatient: boolean | undefined;
    logout: () => void;
}

const log = logger.createLogger();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProviderContext: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userDetails, setUserDetails] = useState<Patient | Practitioner>();
    const [isPatient, setIsPatient] = useState<boolean | undefined>(undefined);
    const [userClaims, setUserClaims] = useState<DecodedToken>();
    const [clientClaims, setClientClaims] = useState<DecodedToken>();

    const AuthHttpClientInstance = AuthHttpClient.getInstance();

    const logout = async () => {
        setIsAuthenticated(false);
        setUserDetails(undefined);
        setUserClaims(undefined);
        await AsyncStorage.multiRemove([
            AsyncStorageData.USER_ACCESS_TOKEN,
            AsyncStorageData.USER_REFRESH_TOKEN,
            AsyncStorageData.CLIENT_ACCESS_TOKEN,
            AsyncStorageData.CLIENT_REFRESH_TOKEN,
        ]);
    };

    const storeTokens = async (accessToken: string, refreshToken: string, isClient: boolean = false) => {
        const tokenKeys = isClient
            ? [AsyncStorageData.CLIENT_ACCESS_TOKEN, AsyncStorageData.CLIENT_REFRESH_TOKEN]
            : [AsyncStorageData.USER_ACCESS_TOKEN, AsyncStorageData.USER_REFRESH_TOKEN];
        await AsyncStorage.multiSet([
            [tokenKeys[0], accessToken],
            [tokenKeys[1], refreshToken],
        ]);
    };

    const getUserDetails = async () => {
        if (!userClaims) throw new Error("User claims are missing");

        const resourceType =
            userClaims.userRole === AllowedFhirTypes.Practitioner
                ? AllowedFhirTypes.Practitioner
                : AllowedFhirTypes.Patient;

        const ResourceDataProviderHttpClientInstance = ResourceDataProviderHttpClient.getInstance(AuthContextEnum.USER);
        const response = await ResourceDataProviderHttpClientInstance.getOne(resourceType, {
            id: userClaims.fhirResourceId,
        });
        if (response.ok) {
            setUserDetails(await response.json());
            if (resourceType === "Patient") {
                setIsPatient(true);
            } else {
                setIsPatient(false);
            }
        } else {
            throw new Error("Failed to fetch user details");
        }
    };

    const decodeAndStoreUserClaims = async (accessToken: string, refreshToken: string, isClient = false) => {
        const decodedToken = decodeToken(accessToken);
        if (!decodedToken) throw new Error("Failed to decode token");

        if (
            decodedToken.userRole === AllowedFhirTypes.Patient ||
            decodedToken.userRole === AllowedFhirTypes.Practitioner
        ) {
            setUserClaims(decodedToken);
            setIsAuthenticated(true);
            await storeTokens(accessToken, refreshToken, isClient);
        } else if (decodedToken.userRole === "Admin") {
            setClientClaims(decodedToken);
            await storeTokens(accessToken, refreshToken, true);
        } else {
            throw new Error("User role not permitted");
        }
    };

    const login = async (setLoading: (value: boolean) => void, data: AuthenticationLogin) => {
        setLoading(true);
        try {
            const clientLoginData = {
                email: process.env.EXPO_PUBLIC_CLIENT_EMAIL!,
                password: process.env.EXPO_PUBLIC_CLIENT_PASSWORD!,
            };

            const [userResponse, clientResponse] = await Promise.all([
                AuthHttpClientInstance.login(data),
                AuthHttpClientInstance.login(clientLoginData),
            ]);

            if (!userResponse.ok || !clientResponse.ok) {
                throw new Error("One or both login requests failed");
            }

            const [userTokenData, clientTokenData] = await Promise.all([userResponse.json(), clientResponse.json()]);

            await decodeAndStoreUserClaims(userTokenData.accessToken, userTokenData.refreshToken);
            await decodeAndStoreUserClaims(clientTokenData.accessToken, clientTokenData.refreshToken, true);
        } catch (error) {
            Alert.alert("An unexpected error occurred during login");
            log.error(error);
        } finally {
            setLoading(false);
        }
    };

    const checkAuthentication = async () => {
        const authenticated = await AuthHttpClientInstance.checkAuthentication(AuthContextEnum.USER);
        setIsAuthenticated(authenticated);
        if (authenticated) {
            const token = await AsyncStorage.getItem(AsyncStorageData.USER_ACCESS_TOKEN);
            if (token) {
                const decodedToken = decodeToken(token);
                if (decodedToken) {
                    setUserClaims(decodedToken);
                } else {
                    log.error("Token decoding failed");
                    await logout();
                }
            }
        }
        return authenticated;
    };

    useEffect(() => {
        if (userClaims) {
            getUserDetails()
                .then(() => log.info("User details loaded"))
                .catch(async (error) => {
                    log.error(error);
                    await logout();
                });
        }
    }, [userClaims]);

    const value = useMemo(
        () => ({
            isAuthenticated,
            userDetails,
            setUserDetails,
            isPatient,
            login,
            checkAuthentication,
            logout,
            clientClaims,
        }),
        [isAuthenticated, userDetails, isPatient],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export { AuthProviderContext, useAuth };
