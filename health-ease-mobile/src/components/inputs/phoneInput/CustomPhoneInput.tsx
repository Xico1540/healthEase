import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { parsePhoneNumber, PhoneNumber } from "libphonenumber-js";
import { Control, Controller, FieldError } from "react-hook-form";
import PhoneInput, { getCountryByPhoneNumber, ICountry } from "react-native-international-phone-number";
import { buildPopularCountries, getDefaultCountryByLocale } from "@/src/utils/localizationUtils";
import ErrorHolder from "@/src/components/common/errorHolder/ErrorHolder";
import Label from "@/src/components/common/label/Label";
import CustomPhoneInputStyles from "@/src/components/inputs/phoneInput/CustomPhoneInputStyles";

interface PhoneInputComponentProps {
    control: Control<any>;
    name: string;
    defaultPhoneNumber: string;
    setValue: (name: any, value: any) => void;
    error?: FieldError | undefined;
    textSize?: number;
    textColor?: string;
    textFontFamily?: string;
    labelFontFamily?: string;
    isRequired?: boolean;
}

const CustomPhoneInput: React.FC<PhoneInputComponentProps> = ({
    control,
    name,
    defaultPhoneNumber,
    error,
    setValue,
    textSize,
    textColor,
    textFontFamily,
    labelFontFamily = "PoppinsRegular",
    isRequired = true,
}) => {
    const [selectedCountry, setSelectedCountry] = useState<ICountry>();
    const [inputValue, setInputValue] = useState<string>(defaultPhoneNumber);
    const { phoneStyles, phoneModalStyles } = CustomPhoneInputStyles();

    if (textFontFamily && typeof phoneStyles.input === "object") {
        phoneStyles.input = { ...phoneStyles.input, fontFamily: textFontFamily };
    }

    if (textColor && typeof phoneStyles.input === "object") {
        phoneStyles.input = { ...phoneStyles.input, color: textColor };
    }

    if (textSize && typeof phoneStyles.input === "object") {
        phoneStyles.input = { ...phoneStyles.input, fontSize: textSize };
    }

    useEffect(() => {
        if (defaultPhoneNumber) {
            const phoneNumber: PhoneNumber = parsePhoneNumber(defaultPhoneNumber);
            if (phoneNumber) {
                const country = getCountryByPhoneNumber(defaultPhoneNumber);
                setSelectedCountry(country);
                const formattedNumber = phoneNumber.formatNational();
                setInputValue(formattedNumber);
                setValue(name, `${country?.callingCode}${formattedNumber}`);
            }
        }
    }, [defaultPhoneNumber, name, setValue]);

    const onChangePhoneNumber = (phoneNumber: string): void => {
        setInputValue(phoneNumber);
        if (selectedCountry && phoneNumber) {
            setValue(name, `${selectedCountry?.callingCode}${phoneNumber}`);
        }
    };

    const onChangeSelectedCountry = (country: ICountry): void => {
        setSelectedCountry(country);
        if (inputValue) {
            setValue(name, `${country.callingCode}${inputValue}`);
        }
    };

    return (
        <View>
            <Label fontFamily={labelFontFamily} title={`Número de telefone${isRequired ? "*" : ""}`} />
            <Controller
                name={name}
                control={control}
                render={() => (
                    <PhoneInput
                        value={inputValue}
                        onChangePhoneNumber={onChangePhoneNumber}
                        selectedCountry={selectedCountry}
                        onChangeSelectedCountry={onChangeSelectedCountry}
                        defaultCountry={getDefaultCountryByLocale()}
                        popularCountries={buildPopularCountries()}
                        phoneInputStyles={phoneStyles}
                        placeholder=""
                        modalSearchInputPlaceholder="Pesquisar indicativo"
                        modalStyles={phoneModalStyles}
                    />
                )}
            />
            {error?.message && <ErrorHolder errorMessage={error.message} />}
        </View>
    );
};

export default CustomPhoneInput;
