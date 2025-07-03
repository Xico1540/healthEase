import { compareObjects, openEmail, pickImage } from "@/src/utils/utils";
import { Linking } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { ImageDetails } from "@/src/model/PatientUserData";
import {
    PatientUserDiffDataObj1,
    PatientUserDiffDataObj2,
    PatientUserEqualDataObj1,
    PatientUserEqualDataObj2,
} from "@/test/testDataUtils";

describe("utils", () => {
    describe("compareObjects", () => {
        test("should return true for equal objects", () => {
            expect(compareObjects(PatientUserEqualDataObj1, PatientUserEqualDataObj2)).toBe(true);
        });

        test("should return false for different objects", () => {
            expect(compareObjects(PatientUserDiffDataObj1, PatientUserDiffDataObj2)).toBe(false);
        });
    });

    describe("openEmail", () => {
        beforeAll(() => {
            (Linking.openURL as jest.Mock).mockResolvedValue(undefined);
        });

        test("should call Linking.openURL with the correct email", () => {
            const email = "test@example.com";
            openEmail(email);
            expect(Linking.openURL).toHaveBeenCalledWith(`mailto:${email}`);
        });
    });

    describe("pickImage", () => {
        const mockSetImages = jest.fn();
        const mockSetValue = jest.fn();
        const mockImages: ImageDetails[] = [];

        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("should pick image from library", async () => {
            (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{ uri: "image-uri", base64: "base64-string", fileName: "image.jpg", mimeType: "image/jpeg" }],
            });
            (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValue({
                uri: "manipulated-uri",
                base64: "manipulated-base64",
            });

            await pickImage("library", mockImages, mockSetImages, mockSetValue, "controllerName", 1);

            expect(SheetManager.hide).toHaveBeenCalledWith("image-picker-options");
            expect(mockSetImages).toHaveBeenCalledWith([
                { uri: "manipulated-uri", base64: "manipulated-base64", fileName: "image.jpg", mimeType: "image/jpeg" },
            ]);
            expect(mockSetValue).toHaveBeenCalledWith("controllerName", [
                { uri: "manipulated-uri", base64: "manipulated-base64", fileName: "image.jpg", mimeType: "image/jpeg" },
            ]);
        });

        test("should pick image from camera", async () => {
            (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{ uri: "image-uri", base64: "base64-string", fileName: "image.jpg", mimeType: "image/jpeg" }],
            });
            (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValue({
                uri: "manipulated-uri",
                base64: "manipulated-base64",
            });

            await pickImage("camera", mockImages, mockSetImages, mockSetValue, "controllerName", 1);

            expect(SheetManager.hide).toHaveBeenCalledWith("image-picker-options");
            expect(mockSetImages).toHaveBeenCalledWith([
                { uri: "manipulated-uri", base64: "manipulated-base64", fileName: "image.jpg", mimeType: "image/jpeg" },
            ]);
            expect(mockSetValue).toHaveBeenCalledWith("controllerName", [
                { uri: "manipulated-uri", base64: "manipulated-base64", fileName: "image.jpg", mimeType: "image/jpeg" },
            ]);
        });
    });
});
