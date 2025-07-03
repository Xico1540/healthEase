import AbstractHttpAuthClient from "./AbstractAuthHttpClient";
import { PractitionerUserDetails } from "../model/Authentication";
/**
 * A concrete HTTP client class for handling authentication.
 * This class provides methods to perform login and token refresh operations.
 * It includes methods to check if the session is valid and to refresh tokens if needed.
 * The class follows the Singleton pattern to ensure only one instance is created.
 */
class UsersHttpClient extends AbstractHttpAuthClient<PractitionerUserDetails> {
    private readonly JSON_CONTENT_TYPE: string = "application/json";
    
    private static instance: UsersHttpClient;

    public static getInstance(): UsersHttpClient {
        if (!UsersHttpClient.instance) {
            UsersHttpClient.instance = new UsersHttpClient(
                process.env.REACT_APP_API_BASE_URL as string,
            );
        }
        return UsersHttpClient.instance;
    }

    public async createPractitionerUser(data: PractitionerUserDetails) {
        return this.post(`users/register`, data, this.JSON_CONTENT_TYPE);
    }
}

export default UsersHttpClient;
