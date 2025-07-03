export enum LoginErrorTypes {
    GET_IDENTITY_ERROR = "GET_IDENTITY_ERROR",
    GET_PERMISSION_ERROR = "PERMISSION_ERROR",
    CHECK_AUTH_ERROR = "CHECK_AUTH_ERROR",
}

export class LoginError extends Error {
    public readonly type: LoginErrorTypes;

    constructor(type: LoginErrorTypes, message?: string) {
        super(message);
        this.type = type;
        this.name = "CustomError";
    }
}
