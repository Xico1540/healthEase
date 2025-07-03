import * as yup from "yup";
import GenderEnum from "@/src/model/GenderEnum";
import validatePhoneNumber from "@/src/utils/validationsUtils";

export enum ErrorType {
    INVALID = "invalid",
    REQUIRED = "required",
    MIN_LENGTH = "minLength",
    MAX_LENGTH = "maxLength",
    TYPE_ERROR = "typeError",
}

export const getErrorMessage = (fieldName: string, errorType: ErrorType, length?: number) => {
    const lowerCaseFieldName = fieldName.toLowerCase();
    switch (errorType) {
        case ErrorType.TYPE_ERROR:
            return `Erro de tipo no campo: ${lowerCaseFieldName}`;
        case ErrorType.INVALID:
            return `Valor inválido no campo: ${lowerCaseFieldName}`;
        case ErrorType.REQUIRED:
            return `O campo ${lowerCaseFieldName} é obrigatório`;
        case ErrorType.MIN_LENGTH:
            return `Tamanho mínimo de ${length} dígidos não atingido no campo ${lowerCaseFieldName}.`;
        case ErrorType.MAX_LENGTH:
            return `Tamanho máximo de ${length} dígidos excedido no campo ${lowerCaseFieldName}.`;
        default:
            throw new Error("Tipo de erro inválido");
    }
};

export const useCommonSchemas = () => ({
    email: yup
        .string()
        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, getErrorMessage("Email", ErrorType.INVALID))
        .required(getErrorMessage("Email", ErrorType.REQUIRED)),
    password: yup
        .string()
        .min(8, getErrorMessage("Palavra-passe", ErrorType.MIN_LENGTH, 8))
        .max(20, getErrorMessage("Palavra-passe", ErrorType.MAX_LENGTH, 20))
        .required(getErrorMessage("Palavra-passe", ErrorType.REQUIRED)),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "As passwords devem ser iguais")
        .required(getErrorMessage("Confirmar palavra-passe", ErrorType.REQUIRED)),
    healthcareServiceIdentifier: yup
        .number()
        .max(999999999, getErrorMessage("Identificador do serviço de saúde", ErrorType.MAX_LENGTH, 9))
        .min(100000000, getErrorMessage("Identificador do serviço de saúde", ErrorType.MIN_LENGTH, 9))
        .typeError(getErrorMessage("Identificador do serviço de saúde", ErrorType.TYPE_ERROR))
        .required(getErrorMessage("Identificador do serviço de saúde", ErrorType.REQUIRED)),
    firstName: yup
        .string()
        .max(20, getErrorMessage("Nome", ErrorType.MAX_LENGTH, 20))
        .min(3, getErrorMessage("Nome", ErrorType.MIN_LENGTH, 3))
        .matches(/^[\p{L}\s]+$/u, getErrorMessage("Nome", ErrorType.INVALID))
        .required(getErrorMessage("Nome", ErrorType.REQUIRED)),
    lastName: yup
        .string()
        .max(20, getErrorMessage("Sobrenome", ErrorType.MAX_LENGTH, 20))
        .min(3, getErrorMessage("Sobrenome", ErrorType.MIN_LENGTH, 3))
        .matches(/^[\p{L}\s]+$/u, getErrorMessage("Sobrenome", ErrorType.INVALID))
        .required(getErrorMessage("Sobrenome", ErrorType.REQUIRED)),
    dateOfBirth: yup
        .date()
        .typeError(getErrorMessage("Data de nascimento", ErrorType.TYPE_ERROR))
        .required(getErrorMessage("Data de nascimento", ErrorType.REQUIRED))
        .max(new Date(Date.now() - 86400000), getErrorMessage("Data de nascimento", ErrorType.INVALID)),
    gender: yup
        .mixed<GenderEnum>()
        .oneOf(Object.values(GenderEnum))
        .required(getErrorMessage("Género", ErrorType.REQUIRED)),
    phoneNumber: yup
        .string()
        .required(getErrorMessage("Número de telefone", ErrorType.REQUIRED))
        .test("validNumber", getErrorMessage("Número de telefone", ErrorType.INVALID), (value: string) => {
            if (value) {
                return validatePhoneNumber(value);
            }
            return false;
        }),
    address: yup.object().shape({
        street: yup.string().required(getErrorMessage("Rua", ErrorType.REQUIRED)),
        city: yup.string().required(getErrorMessage("Cidade", ErrorType.REQUIRED)),
        postalCode: yup.string().required(getErrorMessage("Código postal", ErrorType.REQUIRED)),
    }),
});
