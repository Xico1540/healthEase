import { isNil } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "react-native-logs";
import AbstractHttpClient from "./AbstractHttpClient";
import { AuthContextEnum, AuthenticationLogin, RefreshToken } from "@/src/model/Authentication";
import AsyncStorageData from "@/src/model/AsyncStorageDataEnum";
import decodeToken from "@/src/utils/jwtUtils";

const log = logger.createLogger();

export default class AuthHttpClient extends AbstractHttpClient<AuthenticationLogin | RefreshToken> {
    private readonly JSON_CONTENT_TYPE: string = "application/json";

    private static instance: AuthHttpClient;

    /**
     * Returns a singleton instance of AuthHttpClient.
     * Ensures only one instance of the client exists.
     */
    public static getInstance(): AuthHttpClient {
        AuthHttpClient.instance = new AuthHttpClient(process.env.EXPO_PUBLIC_API_BASE_URL as string);
        return AuthHttpClient.instance;
    }

    /**
     * Prepares HTTP headers with an optional content type.
     * If no content type is provided, defaults to "application/json".
     */
    protected async getHeaders(contentType?: string): Promise<Headers> {
        const headers = new Headers();
        headers.append("Content-Type", contentType || "application/json");
        return headers;
    }

    /**
     * Checks whether the user is authenticated.
     * First verifies if the session is valid, and if not, attempts to refresh the token.
     */
    public async checkAuthentication(authContext: AuthContextEnum): Promise<boolean> {
        if (await this.isSessionValid(authContext)) {
            return true;
        }

        return this.tryRefreshToken(authContext);
    }

    /**
     * Determines the AsyncStorage keys for access and refresh tokens.
     * Differentiates between CLIENT and USER contexts.
     */
    private getTokenKeys(authContext: AuthContextEnum): { accessTokenKey: string; refreshTokenKey: string } {
        return {
            accessTokenKey:
                authContext === AuthContextEnum.CLIENT
                    ? AsyncStorageData.CLIENT_ACCESS_TOKEN
                    : AsyncStorageData.USER_ACCESS_TOKEN,
            refreshTokenKey:
                authContext === AuthContextEnum.CLIENT
                    ? AsyncStorageData.CLIENT_REFRESH_TOKEN
                    : AsyncStorageData.USER_REFRESH_TOKEN,
        };
    }

    /**
     * Checks if the current session is valid by verifying tokens.
     * Ensures both access and refresh tokens are present and that the access token is not expired.
     */
    async isSessionValid(authContext: AuthContextEnum): Promise<boolean> {
        const { accessTokenKey, refreshTokenKey } = this.getTokenKeys(authContext);

        const token = await AsyncStorage.getItem(accessTokenKey);
        const refreshToken = await AsyncStorage.getItem(refreshTokenKey);

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

    /**
     * Attempts to refresh the access token using the stored refresh token.
     * If successful, updates the stored tokens and returns true.
     */
    async tryRefreshToken(authContext: AuthContextEnum): Promise<boolean> {
        const { accessTokenKey, refreshTokenKey } = this.getTokenKeys(authContext);

        const token = await AsyncStorage.getItem(accessTokenKey);
        const refreshToken = await AsyncStorage.getItem(refreshTokenKey);

        if (isNil(token) || isNil(refreshToken)) {
            return false;
        }

        log.debug("Attempting to refresh token");
        const response = await this.refreshToken({ accessToken: token, refreshToken });

        if (response.ok) {
            const tokenData = await response.json();
            await AsyncStorage.setItem(accessTokenKey, tokenData.accessToken);
            await AsyncStorage.setItem(refreshTokenKey, tokenData.refreshToken);
            log.debug("Token refreshed successfully");
            return true;
        }

        log.debug("Failed to refresh token");
        return false;
    }

    /**
     * Sends a login request with the provided credentials.
     * Returns the response from the server.
     */
    public async login(data: AuthenticationLogin): Promise<Response> {
        return this.post(`auth/login`, data, this.JSON_CONTENT_TYPE);
    }

    /**
     * Sends a request to refresh the token using the current access and refresh tokens.
     * Returns the server response.
     */
    public async refreshToken(tokens: { accessToken: string; refreshToken: string }): Promise<Response> {
        return this.post(`auth/refresh`, tokens, this.JSON_CONTENT_TYPE);
    }
}
