import { AuthProvider } from "react-admin";
import AuthService from "./AuthService";
import LocalStorageData from "../model/LocalStorageData";
import AuthHttpClient from "../http/AuthHttpClient";
import { logger } from "react-native-logs";
import { LoginError, LoginErrorTypes } from "../errors/LoginErrors";

const authService = AuthService.getInstance();
const authHttpClient = AuthHttpClient.getInstance();

const log = logger.createLogger();
/**
 * A concrete authentication provider class for managing user authentication.
 * This class provides methods for login, logout, checking authentication status,
 * getting user permissions, and getting user identity. It uses authentication headers
 * for secure communication and follows the Singleton pattern to ensure only one instance is created.
 */
const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        try {
            const data = await authService.login({ email: username, password });
            await authService.handleLoginResponse({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            });
            return Promise.resolve();
        } catch (error) {
            log.error("Error logging in: ", error);
            return Promise.reject("Ocorreu um erro ao fazer login, por favor tente novamente");
        }
    },
    logout: () => {
        localStorage.removeItem(LocalStorageData.USER_ACCESS_TOKEN);
        localStorage.removeItem(LocalStorageData.USER_REFRESH_TOKEN);
        return Promise.resolve();
    },
    checkAuth: async () => {
        const isAuthenticated = await authHttpClient.checkAuthentication();
        return isAuthenticated
            ? Promise.resolve()
            : Promise.reject(new LoginError(LoginErrorTypes.CHECK_AUTH_ERROR, "Error checking authentication"));
    },
    getPermissions: async () => {
        try {
            const { role } = await authService.getIdentity();
            return Promise.resolve(role);
        } catch (error) {
            log.error("Error getting permissions: ", error);
            return Promise.reject(new LoginError(LoginErrorTypes.GET_PERMISSION_ERROR, "Error getting permissions"));
        }
    },
    getIdentity: async () => {
        try {
            const { id, role } = await authService.getIdentity();
            return Promise.resolve({ id, role });
        } catch (error) {
            log.error("Error getting identity: ", error);
            return Promise.reject(new LoginError(LoginErrorTypes.GET_IDENTITY_ERROR, "Error getting identity"));
        }
    },
    checkError: (error) => {
        if (error instanceof LoginError) {
            switch (error.type) {
                case LoginErrorTypes.GET_PERMISSION_ERROR:
                    log.error(error.stack);
                    return Promise.reject(error);
                case LoginErrorTypes.GET_IDENTITY_ERROR:
                    log.error(error.message);
                    return Promise.reject(error);
                case LoginErrorTypes.CHECK_AUTH_ERROR:
                    log.error(error.message);
                    return Promise.reject(error);
                default:
                    return Promise.reject(error);
            }
        }
        return Promise.resolve();
    },
};

export default authProvider;
