import { IPhoneInputStyles } from "react-native-international-phone-number/lib/interfaces/phoneInputStyles";
import { darken, parseToRgb, rgba } from "polished";
import { IModalStyles } from "react-native-international-phone-number/lib/interfaces/modalStyles";
import LightTheme from "@/src/theme/LightTheme";

const CustomPhoneInputStyles = () => {
    const phoneStyles: IPhoneInputStyles = {
        container: {
            backgroundColor: LightTheme.colors.muted,
            borderWidth: 0,
            height: 45,
            borderRadius: 5,
        },
        input: {
            color: LightTheme.colors.black,
            fontFamily: "PoppinsRegular",
            fontSize: 14,
        },
        flagContainer: {
            backgroundColor: darken(0.1, LightTheme.colors.background),
        },
        caret: {
            color: darken(0.2, LightTheme.colors.black),
        },
        divider: {
            backgroundColor: darken(0.3, LightTheme.colors.background),
        },
        callingCode: {
            color: LightTheme.colors.secondaryText,
            fontFamily: "PoppinsMedium",
            fontSize: 14,
        },
    };

    const phoneModalStyles: IModalStyles = {
        modal: {
            backgroundColor: LightTheme.colors.background,
        },
        divider: {
            backgroundColor: LightTheme.colors.muted,
        },
        searchInput: {
            backgroundColor: LightTheme.colors.muted,
            borderWidth: 0,
            fontFamily: "PoppinsMedium",
            color: LightTheme.colors.black,
        },
        backdrop: {
            backgroundColor: rgba({ ...parseToRgb(LightTheme.colors.black), alpha: 0.5 }),
        },
        countryButton: {
            borderColor: LightTheme.colors.muted,
            backgroundColor: LightTheme.colors.muted,
            borderWidth: 1,
        },
        callingCode: {
            color: LightTheme.colors.secondaryText,
            fontFamily: "PoppinsMedium",
        },
        countryName: {
            color: LightTheme.colors.black,
            fontFamily: "PoppinsRegular",
        },
    };

    return {
        phoneStyles,
        phoneModalStyles,
    };
};

export default CustomPhoneInputStyles;
