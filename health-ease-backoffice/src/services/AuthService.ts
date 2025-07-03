import AuthHttpClient from "../http/AuthHttpClient";
import { AuthenticationLogin, AuthLoginResponse } from "../model/Authentication";
import AllowedFhirTypes from "../model/AllowedFhirTypes";
import decodeToken, { DecodedToken } from "../utils/jwtUtils";
import LocalStorageData from "../model/LocalStorageData";

/**
 * A singleton service class for user authentication.
 * This class provides methods for login, handling login responses,
 * storing tokens, and retrieving user identity. It ensures that only
 * one instance of the service is created and used throughout the application.
 */
class AuthService {
    private static instance: AuthService;

    private authHttpClient: AuthHttpClient;

    private constructor() {
        this.authHttpClient = AuthHttpClient.getInstance();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async login(data: AuthenticationLogin): Promise<AuthLoginResponse> {
        const response = await this.authHttpClient.login(data);
        if (!response.ok) {
            throw new Error("Login failed");
        }
        return response.json();
    }

    public handleLoginResponse = async (tokenData: AuthLoginResponse) => {
        const decodedToken: DecodedToken | null = decodeToken(tokenData.accessToken);

        if (!tokenData.accessToken || !tokenData.refreshToken || !decodedToken) {
            throw new Error("Access token, refresh token, or decoded token is null");
        }

        if (decodedToken.userRole === "Admin") {
            await this.storeTokens(tokenData.accessToken, tokenData.refreshToken);
        } else {
            throw new Error("User role is not allowed");
        }
    };

    public async storeTokens(accessToken: string, refreshToken: string) {
        localStorage.setItem(LocalStorageData.USER_ACCESS_TOKEN, accessToken);
        localStorage.setItem(LocalStorageData.USER_REFRESH_TOKEN, refreshToken);
    }

    public async getIdentity() {
        const token = localStorage.getItem(LocalStorageData.USER_ACCESS_TOKEN);
        if (!token) {
            throw new Error("Token is null");
        }
        const decodedToken = decodeToken(token);
        if (!decodedToken) {
            throw new Error("Token is not valid");
        }
        return {
            id: decodedToken.fhirResourceId,
            role: decodedToken.userRole as AllowedFhirTypes,
        };
    }
    
}

export default AuthService;
