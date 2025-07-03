import createPalette, { Palette, PaletteOptions } from "@mui/material/styles/createPalette";
import { darken, lighten } from "@mui/material";

const colorCoefficient: number = 0.5;
export const whiteColor: string = "#FFFFFF";
export const blackColor: string = "#000000";

const primaryTextColor: string = "#000000";
const secondaryTextColor: string = "#898A8A";

const primaryColor: string = "#194093";
const primaryContrastText: string = whiteColor;

const secondaryColor: string = "#194093";
const secondaryContrastText: string = whiteColor;

const errorColor: string = "#ff3636";
const errorContrastText: string = whiteColor;

const warningColor: string = "#ff9800";
const warningContrastText: string = whiteColor;

const infoColor: string = "#2095ff";
const infoContrastText: string = whiteColor;

const successColor: string = "#0dad4c";
const successContrastText: string = whiteColor;

const paperColor: string = whiteColor;
const backgroundColor: string = "#F3F3F3";

export const LightTheme: PaletteOptions = {
    primary: {
        light: lighten(primaryColor, colorCoefficient),
        main: primaryColor,
        dark: darken(primaryColor, colorCoefficient),
        contrastText: primaryContrastText,
    },
    secondary: {
        light: lighten(secondaryColor, colorCoefficient),
        main: secondaryTextColor,
        dark: darken(secondaryColor, colorCoefficient),
        contrastText: secondaryContrastText,
    },
    error: {
        light: lighten(errorColor, colorCoefficient),
        main: errorColor,
        dark: darken(errorColor, colorCoefficient),
        contrastText: errorContrastText,
    },
    success: {
        light: lighten(successColor, colorCoefficient),
        main: successColor,
        dark: darken(successColor, colorCoefficient),
        contrastText: successContrastText,
    },
    warning: {
        light: lighten(warningColor, colorCoefficient),
        main: warningColor,
        dark: darken(warningColor, colorCoefficient),
        contrastText: warningContrastText,
    },
    info: {
        light: lighten(infoColor, colorCoefficient),
        main: infoColor,
        dark: darken(infoColor, colorCoefficient),
        contrastText: infoContrastText,
    },
    background: {
        default: backgroundColor,
        paper: paperColor,
    },
    text: {
        primary: primaryTextColor,
        secondary: secondaryTextColor,
    },
    common: {
        black: blackColor,
        white: whiteColor,
    },
};

export const lightColorPalette: Palette = createPalette(LightTheme);
