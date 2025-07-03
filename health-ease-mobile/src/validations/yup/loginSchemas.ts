import * as yup from "yup";
import { ErrorType, getErrorMessage, useCommonSchemas } from "@/src/validations/yup/commonSchemas";

const LoginSchemas = () => {
    const commonSchema = useCommonSchemas();

    const emailOrSnsRequiredMessage = getErrorMessage("Email ou Número de SNS", ErrorType.REQUIRED);
    const emailOrSnsInvalidMessage = getErrorMessage("Email ou Número de SNS", ErrorType.INVALID);

    const loginSchema = yup.object().shape({
        email: yup
            .string()
            .required(emailOrSnsRequiredMessage)
            .test("email-or-sns", emailOrSnsInvalidMessage, (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const snsNumberRegex = /^\d{9}$/;
                return emailRegex.test(value) || snsNumberRegex.test(value);
            }),
        password: commonSchema.password,
    });

    return {
        loginSchema,
    };
};

export default LoginSchemas;
