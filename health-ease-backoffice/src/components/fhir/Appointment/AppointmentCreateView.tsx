import * as React from "react";
import {
    AutocompleteArrayInput,
    AutocompleteInput,
    Create,
    ReferenceInput,
    SaveButton,
    SimpleForm,
    Toolbar,
} from "react-admin";
import { Card, CardContent } from "@mui/material";
import { CustomBox, CustomGrid, GridWrapper } from "../../styles/styles";
import { getEnumAsChoices, getSpecialitiesAsChoices } from "../../../utils/reactAdminUtils";
import AppointmentController from "../../../controllers/AppointmentController";
import ResourceDataProviderHttpClient from "../../../http/ResourceDataProviderHttpClient";
import { displayFhirHumanName } from "../../../utils/fhirUtils";
import { formatSchedule } from "../../../utils/dateUtils";
import { AppointmentStatus } from "../../../model/fhir/Appointment/AppointmentChoices";
import EditableField from "../../fields/EditableField";

const AppointmentCreateViewToolbar: React.FC = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

const transform = async (data: any) => {
    return await AppointmentController.transformCreateAndEdit(data, ResourceDataProviderHttpClient.getInstance());
};

const AppointmentCreateView: React.FC = () => {
    const specialtiesValueSetMockChoices = getSpecialitiesAsChoices();

    return (
        <Create transform={transform}>
            <Card>
                <CardContent>
                    <SimpleForm toolbar={<AppointmentCreateViewToolbar />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    <ReferenceInput
                                        source="processedPractitioner"
                                        reference="Practitioner"
                                        label="Profissional"
                                        filterToQuery={(searchText: string) => ({ name: searchText })}>
                                        <AutocompleteInput
                                            label="Profissional"
                                            optionText={(record) => displayFhirHumanName(record)}
                                        />
                                    </ReferenceInput>
                                </CustomGrid>
                                <CustomGrid>
                                    <ReferenceInput
                                        source="processedPatient"
                                        reference="Patient"
                                        label="Paciente"
                                        filterToQuery={(searchText: string) => ({ name: searchText })}>
                                        <AutocompleteInput
                                            label="Paciente"
                                            optionText={(record) => displayFhirHumanName(record)}
                                        />
                                    </ReferenceInput>
                                </CustomGrid>
                                <CustomGrid>
                                    <ReferenceInput
                                        source="processedSlot"
                                        reference="Slot"
                                        label="Slot"
                                        filterToQuery={(searchText: string) => ({ name: searchText })}>
                                        <AutocompleteInput
                                            label="Slot"
                                            optionText={(record) => formatSchedule(record.start, record.end)}
                                        />
                                    </ReferenceInput>
                                </CustomGrid>
                                <CustomGrid>
                                    <AutocompleteArrayInput
                                        source="processedSpecialty"
                                        label="Especialidade"
                                        choices={specialtiesValueSetMockChoices}
                                        optionText="display"
                                        optionValue="code"
                                        parse={(value) =>
                                            value.map((code: string) => {
                                                const selectedSpecialty = specialtiesValueSetMockChoices.find(
                                                    (item) => item.code === code,
                                                );
                                                return selectedSpecialty
                                                    ? {
                                                          code: selectedSpecialty.code,
                                                          display: selectedSpecialty.display,
                                                      }
                                                    : { code };
                                            })
                                        }
                                        format={(value) =>
                                            value.map((item: { code: string; display: string } | string) =>
                                                typeof item === "string" ? item : item.code,
                                            )
                                        }
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField
                                        source="status"
                                        type="select"
                                        choices={getEnumAsChoices(AppointmentStatus)}
                                        label="Estado"
                                        isEditing={true}
                                    />
                                </CustomGrid>
                            </GridWrapper>
                        </CustomBox>
                    </SimpleForm>
                </CardContent>
            </Card>
        </Create>
    );
};

export default AppointmentCreateView;
