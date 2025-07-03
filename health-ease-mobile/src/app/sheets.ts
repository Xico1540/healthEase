import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import ImagePickerOptionsSheet from "@/src/components/common/sheets/ImagePickerOptionsSheet";
import { EnrichedAppointment } from "@/src/app/home/screens/PractitionerHomeScreen/PractitionerHomeScreen";
import AppointmentDetailsSheet from "@/src/app/home/components/AppointmentDetails/AppointmentDetailsSheet";

registerSheet("image-picker-options", ImagePickerOptionsSheet);
registerSheet("appointment-details", AppointmentDetailsSheet);

declare module "react-native-actions-sheet" {
    interface Sheets {
        "image-picker-options": SheetDefinition<{
            payload: {
                onPickImage: (source: "library" | "camera") => void;
            };
        }>;
        "appointment-details": SheetDefinition<{
            payload: {
                enrichedAppointment: EnrichedAppointment;
            };
        }>;
    }
}

export {};
