import { Address, Attachment, HumanName, Patient, Practitioner } from "fhir/r4";
import { cloneDeep, isEmpty, isNil } from "lodash";
import GenderEnum from "@/src/model/GenderEnum";
import { ImageDetails, PatientUserData, UserAddress, UserPersonalInformation } from "@/src/model/PatientUserData";
import { PractitionerUserData } from "@/src/model/PractitionerUserData";

export type FHIRGender = "male" | "female" | "other" | "unknown" | undefined;
export type FHIRTelecomSystem = "phone" | "fax" | "email" | "pager" | "url" | "sms" | "other" | undefined;
export const DEFAULT_BIRTH_DATE = "1900-01-01T00:00:00.000Z";

/**
 * Controller for transforming FHIR Patient and Practitioner resources.
 */
class UserController {
    /**
     * Transforms a FHIR resource (Patient or Practitioner) into user data for display.
     * @param userResource - The FHIR resource to transform.
     * @returns The transformed user data, or undefined if transformation fails.
     */
    static transformShow(userResource: Patient | Practitioner): PatientUserData | undefined {
        if ("resourceType" in userResource && userResource.resourceType === "Patient") {
            return this.transformPatient(userResource as Patient);
        }
        return this.transformPractitioner(userResource as Practitioner);
    }

    /**
     * Extracts common fields from FHIR resources into user data.
     * @param data - The FHIR resource (Patient or Practitioner) to extract common data from.
     * @returns Partial user data with common fields.
     */
    static transformCommon<T extends Patient | Practitioner>(data: T): Partial<PatientUserData & PractitionerUserData> {
        return {
            personalInformation: {
                firstName: data.name?.[0]?.given?.[0] || "",
                lastName: data.name?.[0]?.family || "",
                dateOfBirth: !isNil(data.birthDate) ? new Date(data.birthDate) : new Date(DEFAULT_BIRTH_DATE),
                gender: data.gender?.toLowerCase() as GenderEnum,
                address: {
                    street: data.address?.[0]?.line?.[0] || undefined,
                    city: data.address?.[0]?.city || undefined,
                    postalCode: data.address?.[0]?.postalCode || undefined,
                },
                photo: data.photo
                    ? [
                        {
                            base64: !isNil(data.photo?.[0].data)
                                ? `data:${data.photo?.[0].contentType};base64, ${data.photo?.[0].data}`
                                : undefined,
                            uri: !isNil(data.photo?.[0].url) ? data.photo?.[0].url : undefined,
                        },
                    ]
                    : undefined,
            },
            contacts: {
                phoneNumber: data.telecom?.find((t) => t.system === "phone")?.value || "",
                email: data.telecom?.find((t) => t.system === "email")?.value || "",
            },
        } as PatientUserData;
    }

    /**
     * Transforms a FHIR Patient resource into user data.
     * @param patient - The FHIR Patient resource to transform.
     * @returns The transformed patient user data.
     */
    static transformPatient(patient: Patient): PatientUserData {
        const commonData = this.transformCommon(patient);
        return {
            ...commonData,
            personalInformation: {
                ...commonData.personalInformation,
                healthcareServiceIdentifier: parseInt(
                    patient?.identifier?.find(
                        (id) => id.system?.replace(/\/$/, "") === process.env.EXPO_PUBLIC_FHIR_BASE_URL,
                    )?.value as string,
                    10,
                ),
            },
        } as PatientUserData;
    }

    /**
     * Transforms a FHIR Practitioner resource into user data.
     * @param practitioner - The FHIR Practitioner resource to transform.
     * @returns The transformed practitioner user data.
     */
    static transformPractitioner(practitioner: Practitioner): PractitionerUserData {
        const commonData = this.transformCommon(practitioner);

        const aboutMeExtension = practitioner.extension?.find((ext) => ext.url.includes("aboutMe"));
        const aboutMe = aboutMeExtension?.valueString || "";

        const educationExtension = practitioner.extension?.find((ext) => ext.url.includes("education"));
        const educationInstitution = educationExtension?.valueString || "";

        return {
            ...commonData,
            profissionalData: {
                about: aboutMe,
                educationInstitution,
            },
        } as PractitionerUserData;
    }

    /**
     * Transforms user profile data into an updated FHIR resource.
     * @param resource - The existing FHIR resource (Patient or Practitioner).
     * @param userProfile - The user profile data to apply.
     * @returns The updated FHIR resource.
     */
    static transformEdit(
        resource: Patient | Practitioner,
        userProfile: PatientUserData | PractitionerUserData,
    ): Patient | Practitioner {
        if ("resourceType" in resource && resource.resourceType === "Patient") {
            return this.transformEditPatient(resource as Patient, userProfile as PatientUserData);
        }
        return this.transformEditPractitioner(resource as Practitioner, userProfile as PractitionerUserData);
    }

    /**
     * Updates a FHIR Patient resource with user profile data.
     * @param patient - The existing FHIR Patient resource.
     * @param userProfile - The user profile data to apply.
     * @returns The updated FHIR Patient resource.
     */
    private static transformEditPatient(patient: Patient, userProfile: PatientUserData): Patient {
        const processedPatient = this.transformCommonEdit(patient, userProfile);
        const identifierIndex = processedPatient.identifier?.findIndex((id) => id.value);
        if (identifierIndex !== undefined && identifierIndex !== -1) {
            if (processedPatient?.identifier?.[identifierIndex]) {
                processedPatient.identifier[identifierIndex].value =
                    userProfile.personalInformation.healthcareServiceIdentifier.toString();
            }
        } else {
            processedPatient?.identifier?.push({
                value: userProfile.personalInformation.healthcareServiceIdentifier.toString(),
            });
        }

        return processedPatient;
    }

    /**
     * Updates a FHIR Practitioner resource with user profile data.
     * @param practitioner - The existing FHIR Practitioner resource.
     * @param userProfile - The user profile data to apply.
     * @returns The updated FHIR Practitioner resource.
     */
    private static transformEditPractitioner(
        practitioner: Practitioner,
        userProfile: PractitionerUserData,
    ): Practitioner {
        const processedPractitioner = this.transformCommonEdit(practitioner, userProfile);
        const updateAboutMe = (about: string | undefined): void => {
            if (!about) return;

            const index = processedPractitioner.extension?.findIndex((ext) => ext.url.includes("aboutMe"));
            if (index !== undefined && index !== -1) {
                if (processedPractitioner.extension) {
                    processedPractitioner.extension[index].valueString = about;
                }
            } else {
                processedPractitioner.extension?.push({
                    url: `${process.env.EXPO_PUBLIC_FHIR_BASE_URL}/aboutMe`,
                    valueString: about,
                });
            }
        };

        const updateEducation = (educationInstitution: string | undefined): void => {
            if (!educationInstitution) return;

            const index = processedPractitioner.extension?.findIndex((ext) => ext.url.includes("education"));
            if (index !== undefined && index !== -1) {
                if (processedPractitioner.extension) {
                    processedPractitioner.extension[index].valueString = educationInstitution;
                }
            } else {
                processedPractitioner.extension?.push({
                    url: `${process.env.EXPO_PUBLIC_FHIR_BASE_URL}/education`,
                    valueString: educationInstitution,
                });
            }
        };

        updateAboutMe(userProfile.profissionalData?.about);
        updateEducation(userProfile.profissionalData?.educationInstitution);

        return processedPractitioner;
    }

    /**
     * Applies common updates to FHIR resources (Patient or Practitioner).
     * @param resource - The existing FHIR resource.
     * @param userProfile - The user profile data to apply.
     * @returns The updated FHIR resource.
     */
    private static transformCommonEdit<T extends Patient | Practitioner>(
        resource: T,
        userProfile: PatientUserData | PractitionerUserData,
    ): T {
        const processedResource = cloneDeep(resource);
        processedResource.meta = {
            ...processedResource.meta,
            lastUpdated: new Date().toISOString(),
            versionId: undefined,
        };
        processedResource.text = undefined;

        const updateName = (userPersonalInformation: UserPersonalInformation): HumanName[] => [
            {
                given: [userPersonalInformation.firstName],
                family: userPersonalInformation.lastName,
            },
        ];

        const updateTelecom = (system: FHIRTelecomSystem, value?: string) => {
            const cleanedValue = value?.replace(/\s+/g, "");
            const index = processedResource.telecom?.findIndex((telecom) => telecom.system === system);
            if (index !== undefined && index !== -1) {
                if (processedResource.telecom) {
                    processedResource.telecom[index].value = cleanedValue;
                }
            } else {
                processedResource.telecom?.push({ system, value: cleanedValue });
            }
        };

        const updateAddress = (addressData: UserAddress): Address[] | undefined => {
            if (isNil(addressData) || isEmpty(addressData)) {
                return undefined;
            }
            return [
                {
                    line: addressData.street ? [addressData.street] : undefined,
                    city: addressData.city || undefined,
                    postalCode: addressData.postalCode || undefined,
                },
            ];
        };

        const updatePhoto = (
            photoInfo: ImageDetails | undefined,
            originalPhoto: Attachment[] | undefined,
        ): Attachment[] | undefined => {
            if (!photoInfo) {
                return undefined;
            }
            if (!photoInfo.uri) {
                return originalPhoto;
            }

            return [
                {
                    contentType: photoInfo.mimeType || undefined,
                    data: photoInfo.base64 || undefined,
                },
            ];
        };

        processedResource.name = updateName(userProfile.personalInformation);
        const [date] = userProfile.personalInformation.dateOfBirth.toISOString().split("T");
        processedResource.birthDate = date;
        processedResource.gender = userProfile.personalInformation.gender.toLowerCase() as FHIRGender;
        processedResource.address = updateAddress(userProfile.personalInformation.address);
        updateTelecom("phone", userProfile.contacts.phoneNumber);
        updateTelecom("email", userProfile.contacts.email);
        processedResource.photo = updatePhoto(userProfile?.personalInformation?.photo?.[0], processedResource.photo);

        return processedResource;
    }
}

export default UserController;
