import { Patient, Practitioner } from "fhir/r4";
import { UserRegistrationDto } from "@/src/model/UserRegistration";
import UserHttpClient from "@/src/http/UserHttpClient";
import { AuthContextEnum } from "@/src/model/Authentication";

class UserService {
    private static instance: UserService;

    private userHttpClient = UserHttpClient.getInstance(AuthContextEnum.NO_AUTH);

    private userHttpAuthClient = UserHttpClient.getInstance(AuthContextEnum.USER);

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    public async registerUser(user: UserRegistrationDto) {
        const response = await this.userHttpClient.register(user);
        if (!response.ok) {
            throw new Error("Failed to register user");
        }
    }

    public async updateUser(user: Patient | Practitioner) {
        const response = await this.userHttpAuthClient.update(user);
        if (!response.ok) {
            throw new Error("Failed to update user");
        }
    }
}

export default UserService;
