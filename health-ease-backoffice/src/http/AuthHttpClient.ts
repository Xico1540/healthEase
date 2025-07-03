import { isNil } from "lodash";
import { logger } from "react-native-logs";
import AbstractHttpClient from "./AbstractHttpClient";
import LocalStorageData from "../model/LocalStorageData";
import decodeToken from "../utils/jwtUtils";
import { AuthenticationLogin, AuthLoginResponse, PractitionerUserDetails } from "../model/Authentication";

const log = logger.createLogger();

/**
 * A concrete HTTP client class for handling authentication.
 * This class provides methods to perform login and token refresh operations.
 * It includes methods to check if the session is valid and to refresh tokens if needed.
 * The class follows the Singleton pattern to ensure only one instance is created.
 */
export default class AuthHttpClient extends AbstractHttpClient<AuthenticationLogin | AuthLoginResponse | PractitionerUserDetails> {
    private readonly JSON_CONTENT_TYPE: string = "application/json";

    private static instance: AuthHttpClient;

    public static getInstance(): AuthHttpClient {
        if (!AuthHttpClient.instance) {
            AuthHttpClient.instance = new AuthHttpClient(process.env.REACT_APP_API_BASE_URL as string);
        }
        return AuthHttpClient.instance;
    }

    protected async getHeaders(contentType?: string): Promise<Headers> {
        const headers = new Headers();
        headers.append("Content-Type", contentType || "application/json");
        return headers;
    }

    public async checkAuthentication(): Promise<boolean> {
        if (await this.isSessionValid()) {
            return true;
        }
        return this.tryRefreshToken();
    }

    async isSessionValid(): Promise<boolean> {
        const token = localStorage.getItem(LocalStorageData.USER_ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(LocalStorageData.USER_REFRESH_TOKEN);

        if (isNil(token) || isNil(refreshToken)) {
            return false;
        }

        const decodedToken = decodeToken(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken && decodedToken.exp && decodedToken.exp < currentTime) {
            log.debug("Token expired, needs refresh");
            return false;
        }

        return true;
    }

    async tryRefreshToken(): Promise<boolean> {
        const token = localStorage.getItem(LocalStorageData.USER_ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(LocalStorageData.USER_REFRESH_TOKEN);

        if (isNil(token) || isNil(refreshToken)) {
            return false;
        }

        log.debug("Attempting to refresh token");
        const response = await this.refreshToken({ accessToken: token, refreshToken });

        if (response.ok) {
            const tokenData = await response.json();
            localStorage.setItem(LocalStorageData.USER_ACCESS_TOKEN, tokenData.accessToken);
            localStorage.setItem(LocalStorageData.USER_REFRESH_TOKEN, tokenData.refreshToken);
            log.debug("Token refreshed successfully");
            return true;
        }

        log.debug("Failed to refresh token");
        return false;
    }

    public async login(data: AuthenticationLogin): Promise<Response> {
        return this.post(`auth/login`, data, this.JSON_CONTENT_TYPE);
    }

    public async refreshToken(tokens: { accessToken: string; refreshToken: string }): Promise<Response> {
        return this.post(`auth/refresh`, tokens, this.JSON_CONTENT_TYPE);
    }
    
}
