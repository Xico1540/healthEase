import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { Form, required, TextInput, useLogin, useNotify } from "react-admin";
import {
    HintText,
    InputBox,
    InputContainer,
    LoginCard,
    LoginCardActions,
    LoginFormContainer,
    SubmitButton,
} from "./LoginStyles";
import logo from "../../assets/images/logo.svg";
import localStorageData from "../../model/LocalStorageData";

interface LocationState {
    nextPathname: string;
}

const getErrorMessage = (error: Error | undefined): string => {
    return typeof error === "undefined" || !error.message ? "ra.auth.sign_in_error" : error.message;
};

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const notify = useNotify();
    const login = useLogin();
    const location = useLocation();

    if (localStorage.getItem(localStorageData.USER_ACCESS_TOKEN)) {
        return null;
    }

    const handleSubmit = (auth: FormValues) => {
        setLoading(true);
        login(auth, location.state ? (location.state as LocationState).nextPathname : "/").catch((error: Error) => {
            setLoading(false);
            notify(getErrorMessage(error), {
                type: "error",
                messageArgs: {
                    _: error && error.message ? error.message : undefined,
                },
            });
        });
    };

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <LoginFormContainer>
                <LoginCard>
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Box component="img" src={logo} alt="HealthEase" width="200px" />
                    </Box>
                    <HintText>Your health, at your ease.</HintText>
                    <InputContainer>
                        <InputBox>
                            <TextInput
                                autoFocus
                                source="username"
                                label="Email"
                                disabled={loading}
                                validate={required()}
                                InputProps={{
                                    style: {
                                        backgroundColor: "rgba(51,134,175,0.15)",
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: "rgba(19,101,143,0.5)",
                                    },
                                }}
                                inputProps={{
                                    style: {
                                        color: "#13658f",
                                    },
                                }}
                            />
                        </InputBox>
                        <InputBox>
                            <TextInput
                                source="password"
                                label="Senha"
                                type="password"
                                disabled={loading}
                                validate={required()}
                                InputProps={{
                                    style: {
                                        backgroundColor: "rgba(51,134,175,0.15)",
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: "rgba(19,101,143,0.5)",
                                    },
                                }}
                                inputProps={{
                                    style: {
                                        color: "#13658f",
                                    },
                                }}
                            />
                        </InputBox>
                    </InputContainer>
                    <LoginCardActions>
                        <SubmitButton variant="contained" type="submit" color="primary" disabled={loading}>
                            {loading && <CircularProgress size={25} thickness={2} />}
                            Entrar
                        </SubmitButton>
                    </LoginCardActions>
                </LoginCard>
            </LoginFormContainer>
        </Form>
    );
};

export default LoginPage;

interface FormValues {
    username?: string;
    password?: string;
}
