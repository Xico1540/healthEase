import styled from "styled-components";
import { Box, Button, Card, CardActions } from "@mui/material";
import loginWallpaper from "../../assets/images/login-wallpaper.png";

export const LoginFormContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-image: url(${loginWallpaper}) !important;
`;

export const LoginCard = styled(Card)`
    min-width: 400px;
    background-color: white !important;
    border-radius: 15px !important;
    padding: 1em;
    box-shadow: none !important;
`;

export const AvatarContainer = styled(Box)`
    margin: 1em;
    display: flex;
    justify-content: center;
`;

export const HintText = styled(Box)`
    margin-top: 1em;
    display: flex;
    justify-content: center;
    color: #a9a9a9;
`;

export const InputContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    margin-top: 1em;
`;

export const InputBox = styled(Box)``;

export const LoginCardActions = styled(CardActions)`
    padding: 0 !important;
`;

export const SubmitButton = styled(Button)`
    width: 100%;
    background-color: #3386af !important;
    color: white !important;

    &:hover {
        background-color: #135f85 !important;
    }
`;
