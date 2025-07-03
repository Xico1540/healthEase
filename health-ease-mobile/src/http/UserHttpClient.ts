import { Patient, Practitioner } from "fhir/r4";
import { UserRegistrationDto } from "@/src/model/UserRegistration";
import AbstractAuthHttpClient from "@/src/http/AbstractAuthHttpClient";
import { AuthContextEnum } from "@/src/model/Authentication";

/**
 * HTTP Client for managing user-related operations.
 * Supports registering and updating patients and practitioners using FHIR standards.
 */
class UserHttpClient extends AbstractAuthHttpClient<UserRegistrationDto | Patient | Practitioner> {
    private static instance: UserHttpClient;

    private baseEndpoint: string = "users/register/patient";

    private fhirEndpoint: string = "fhir";

    private patientEndpoint: string = `${this.fhirEndpoint}/Patient`;

    private practitionerEndpoint: string = `${this.fhirEndpoint}/Practitioner`;

    private readonly authContext: AuthContextEnum;

    /**
     * Private constructor to enforce singleton pattern.
     * @param baseURL - Base URL for API endpoints.
     * @param authContext - Authentication context to determine header requirements.
     */
    private constructor(baseURL: string, authContext: AuthContextEnum) {
        super(baseURL);
        this.authContext = authContext;
    }

    /**
     * Returns the singleton instance of UserHttpClient.
     * @param authContext - Authentication context to use with the client.
     * @returns The singleton UserHttpClient instance.
     */
    public static getInstance(authContext: AuthContextEnum): UserHttpClient {
        UserHttpClient.instance = new UserHttpClient(process.env.EXPO_PUBLIC_API_BASE_URL as string, authContext);
        return UserHttpClient.instance;
    }

    /**
     * Overrides the method to generate HTTP headers.
     * Adds headers based on the authentication context.
     * @param contentType - Optional content type for the request.
     * @returns A promise resolving to the HTTP headers.
     */
    protected async getHeaders(contentType?: string): Promise<Headers> {
        if (this.authContext === AuthContextEnum.NO_AUTH) {
            const headers = new Headers();
            headers.append("Content-Type", contentType || "application/json");
            return Promise.resolve(headers);
        }
        return super.getHeaders(this.authContext, contentType);
    }

    /**
     * Registers a new user as a patient.
     * @param userData - The user registration data to send to the API.
     * @returns A promise resolving to the response of the registration request.
     */
    public async register(userData: UserRegistrationDto): Promise<Response> {
        return this.post(`${this.baseEndpoint}`, userData);
    }

    /**
     * Updates a FHIR resource (either a Patient or a Practitioner).
     * Determines the endpoint based on the resource type.
     * @param userData - The FHIR resource data to update.
     * @returns A promise resolving to the response of the update request.
     */
    public async update(userData: Patient | Practitioner): Promise<Response> {
        const endpoint = (userData as Patient).resourceType === "Patient" ? this.patientEndpoint : this.practitionerEndpoint;
        return this.put(`${endpoint}/${userData.id}`, userData);
    }
}

export default UserHttpClient;
