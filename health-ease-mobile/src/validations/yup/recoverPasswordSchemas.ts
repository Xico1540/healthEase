import * as yup from "yup";
import { ErrorType, getErrorMessage } from "@/src/validations/yup/commonSchemas";

const RecoverPasswordSchemas = () => {
    const recoverPasswordSchema = yup.object().shape({
        email: yup
            .string()
            .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
                message: getErrorMessage("Email", ErrorType.INVALID),
            })
            .required(getErrorMessage("Email", ErrorType.REQUIRED)),
    });

    return {
        recoverPasswordSchema,
    };
};

export default RecoverPasswordSchemas;
