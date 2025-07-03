import { jwtDecode } from "jwt-decode";

interface RawDecodedToken {
    fhir_resource_id: string;
    user_role: string;
    nbf: number;
    exp: number;
    iat: number;
    iss: string;
    aud: string;
    [key: string]: string | number;
}

export interface DecodedToken {
    fhirResourceId: string;
    userRole: string;
    nbf: number;
    exp: number;
    iat: number;
    iss: string;
    aud: string;
    [key: string]: string | number;
}

const keyMapping: { [key: string]: string } = {
    fhir_resource_id: "fhirResourceId",
    user_role: "userRole",
    nbf: "nbf",
    exp: "exp",
    iat: "iat",
    iss: "iss",
    aud: "aud",
};

function mapDecodedToken(rawDecodedToken: RawDecodedToken): DecodedToken {
    return Object.keys(rawDecodedToken).reduce((acc, key) => {
        const mappedKey = keyMapping[key];
        if (mappedKey) {
            acc[mappedKey] = rawDecodedToken[key];
        }
        return acc;
    }, {} as DecodedToken);
}

function decodeToken(token: string): DecodedToken | null {
    try {
        const decoded = jwtDecode<RawDecodedToken>(token);
        return mapDecodedToken(decoded);
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}

export default decodeToken;
