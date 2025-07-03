import UsersHttpClient from "../http/UsersHttpClient";
import { HttpError, PractitionerUserDetails } from "../model/Authentication";
/**
 * A singleton service class for interacting with the UsersHttpClient.
 * This class provides methods to create practitioner users.
 * It ensures that only one instance of the service is created and used throughout the application.
 */
class UsersService {
    private static instance: UsersService;

    private usersHttpClient: UsersHttpClient;

    private constructor() {
        this.usersHttpClient = UsersHttpClient.getInstance();
    }

    public static getInstance(): UsersService {
        if (!UsersService.instance) {
            UsersService.instance = new UsersService();
        }
        return UsersService.instance;
    }

    public async createPractitionerUser(data: PractitionerUserDetails): Promise<any> {
        const response = await this.usersHttpClient.createPractitionerUser(data);
        if (!response.ok) {
            const error: HttpError = new Error("Error creating practitioner user");
            error.response = response;
            throw error;
        }
        return response.json();
    }

}

export default UsersService;
