import { logger } from "react-native-logs";
import AbstractHttpClient from "./AbstractHttpClient";
import AuthHttpClient from "./AuthHttpClient";
import LocalStorageData from "../model/LocalStorageData";

const log = logger.createLogger();

/**
 * An abstract class for handling HTTP requests with authentication.
 * This class provides methods to get headers with authentication tokens and refresh tokens if needed.
 */
class AbstractHttpAuthClient<T> extends AbstractHttpClient<T> {
    private AuthHttpClientInstance = AuthHttpClient.getInstance();

    public constructor(baseUrl: string) {
        super(baseUrl);
    }

    protected async getHeaders(contentType?: string): Promise<Headers> {
        const headers = new Headers();

        if (!(await this.AuthHttpClientInstance.isSessionValid())) {
            log.debug("Token is not valid, refreshing token");
            await this.AuthHttpClientInstance.tryRefreshToken();
        }

        const token = localStorage.getItem(LocalStorageData.USER_ACCESS_TOKEN);
        headers.append("Content-Type", contentType || "application/json");
        if (token) {
            headers.append("Authorization", `Bearer ${token}`);
        }
        return headers;
    }
}

export default AbstractHttpAuthClient;
