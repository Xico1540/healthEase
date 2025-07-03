import { logger } from "react-native-logs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AbstractHttpClient from "@/src/http/AbstractHttpClient";
import AsyncStorageData from "@/src/model/AsyncStorageDataEnum";
import AuthHttpClient from "@/src/http/AuthHttpClient";
import { AuthContextEnum } from "@/src/model/Authentication";

const log = logger.createLogger();

class AbstractHttpAuthClient<T> extends AbstractHttpClient<T> {
    // Instance of AuthHttpClient to handle authentication-related HTTP requests
    private AuthHttpClientInstance = AuthHttpClient.getInstance();

    // Static function to handle logout, can be set externally
    private static logoutFunction: () => void;

    // Method to retrieve the token from AsyncStorage based on the authentication context
    private async getToken(authContext: AuthContextEnum): Promise<string | null> {
        switch (authContext) {
            case AuthContextEnum.USER:
                return AsyncStorage.getItem(AsyncStorageData.USER_ACCESS_TOKEN);
            case AuthContextEnum.CLIENT:
                return AsyncStorage.getItem(AsyncStorageData.CLIENT_ACCESS_TOKEN);
            default:
                return null;
        }
    }

    // Method to get the headers for an HTTP request, including the authorization token if available
    protected async getHeaders(authContext: AuthContextEnum, contentType?: string): Promise<Headers> {
        const headers = new Headers();

        // Check if the session is valid, if not, try to refresh the token
        if (!(await this.AuthHttpClientInstance.isSessionValid(authContext))) {
            log.debug("Token is not valid, refreshing token");
            const refreshTokenSuccess = await this.AuthHttpClientInstance.tryRefreshToken(authContext);
            if (!refreshTokenSuccess) {
                log.debug("Token refresh failed, logging out");
                if (AbstractHttpAuthClient.logoutFunction) {
                    AbstractHttpAuthClient.logoutFunction();
                }
            }
        }

        // Retrieve the token and set the headers
        const token = await this.getToken(authContext);
        headers.append("Content-Type", contentType || "application/json");
        if (token) {
            headers.append("Authorization", `Bearer ${token}`);
        }
        return headers;
    }
}

export default AbstractHttpAuthClient;