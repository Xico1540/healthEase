export interface HttpError extends Error {
    response?: Response;
}

export type AuthenticationLogin = {
    email: string;
    password: string;
};

export type AuthLoginResponse = {
    accessToken: string;
    refreshToken: string;
};

export type PractitionerUserDetails = {
    id?: string;
    email: string;
    role: number;
}
