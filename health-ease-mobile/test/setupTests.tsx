// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

jest.mock("expo-localization", () => ({
    getLocales: jest.fn(),
}));

jest.mock("country-list", () => ({
    getCode: jest.fn(),
}));

jest.mock("react-native", () => ({
    Linking: {
        openURL: jest.fn(),
    },
}));

jest.mock("react-native-actions-sheet", () => ({
    SheetManager: {
        hide: jest.fn(),
    },
}));

jest.mock("expo-image-picker", () => ({
    launchImageLibraryAsync: jest.fn(),
    launchCameraAsync: jest.fn(),
    MediaTypeOptions: {
        Images: "Images",
    },
}));

jest.mock("expo-image-manipulator", () => ({
    manipulateAsync: jest.fn(),
    SaveFormat: {
        JPEG: "jpeg",
    },
}));

jest.mock("libphonenumber-js", () => ({
    findPhoneNumbersInText: jest.fn(),
    isPossiblePhoneNumber: jest.fn(),
}));
