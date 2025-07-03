import { darken } from "polished";
import { PickerStyle } from "react-native-picker-select";
import LightTheme from "@/src/theme/LightTheme";

const DatePickerStyles = () => {
    const pickerStyle: PickerStyle = {
        placeholder: {
            color: LightTheme.dark ? LightTheme.colors.white : LightTheme.colors.black,
        },
        inputIOS: {
            fontSize: 14,
            fontFamily: "PoppinsRegular",
            color: LightTheme.dark ? LightTheme.colors.white : LightTheme.colors.black,
            paddingLeft: 10,
        },
        inputAndroid: {
            fontSize: 14,
            fontFamily: "PoppinsRegular",
            color: LightTheme.dark ? LightTheme.colors.white : LightTheme.colors.black,
            paddingLeft: 10,
        },
        iconContainer: {
            paddingRight: 10,
            height: "100%",
            justifyContent: "center",
        },
        modalViewMiddleDark: {
            borderTopColor: LightTheme.colors.secondaryText,
            backgroundColor: LightTheme.colors.secondaryText,
        },
        modalViewBottomDark: {
            backgroundColor: LightTheme.colors.primary,
        },
        modalViewMiddle: {
            backgroundColor: LightTheme.colors.muted,
            borderTopColor: LightTheme.colors.muted,
        },
        modalViewBottom: {
            backgroundColor: darken(0.05, LightTheme.colors.muted),
        },
    };

    return pickerStyle;
};

export default DatePickerStyles;
