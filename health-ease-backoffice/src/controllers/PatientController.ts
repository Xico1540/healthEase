import { RaRecord } from "react-admin";
import { isNil } from "lodash";
/**
 * A controller class for handling transformations of location data.
 * This class provides methods to transform location data for showing, creating, and editing.
 */
export class PatientController {
    static async transformCreate(formData: RaRecord) {
        const patient: any = { ...formData } as any;

        if (!isNil(formData.snsIdentifier)) {
            patient.identifier = [
                {
                    system: "heathId",
                    value: formData.snsIdentifier,
                },
            ];
        }

        patient.snsIdentifier = undefined;

        return patient;
    }
}
