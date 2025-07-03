export enum DataErrorTypes {
    DELETE_RESOURCE_REFERENCE_ERROR = "DELETE_RESOURCE_REFERENCE_ERROR",
    UPDATE_RESOURCE_ERROR = "UPDATE_RESOURCE_ERROR",
}

export class DataError extends Error {
    public readonly type: DataErrorTypes;

    constructor(type: DataErrorTypes, message?: string) {
        super(message);
        this.type = type;
        this.name = "CustomError";
    }
}
