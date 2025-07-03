import * as yup from "yup";
import { useCommonSchemas } from "@/src/validations/yup/commonSchemas";

const RegistrationSchemas = () => {
    const commonSchema = useCommonSchemas();

    const personalInfoSchema = yup.object().shape({
        firstName: commonSchema.firstName,
        lastName: commonSchema.lastName,
        gender: commonSchema.gender,
        dateOfBirth: commonSchema.dateOfBirth,
    });

    const healthIDSchema = yup.object().shape({
        healthcareServiceIdentifier: commonSchema.healthcareServiceIdentifier,
    });

    const contactPreferencesSchema = yup.object().shape({
        email: commonSchema.email,
        phoneNumber: commonSchema.phoneNumber,
    });

    const addressSchema = commonSchema.address;

    const credentialsSchema = yup.object().shape({
        password: commonSchema.password,
        confirmPassword: commonSchema.confirmPassword,
    });

    return {
        personalInfoSchema,
        healthIDSchema,
        contactPreferencesSchema,
        addressSchema,
        credentialsSchema,
    };
};

export default RegistrationSchemas;
