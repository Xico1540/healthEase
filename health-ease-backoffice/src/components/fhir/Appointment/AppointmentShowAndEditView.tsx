import * as React from "react";
import { useState } from "react";
import {
    AutocompleteArrayInput,
    AutocompleteInput,
    DeleteButton,
    Edit,
    FunctionField,
    Labeled,
    ReferenceField,
    ReferenceInput,
    SaveButton,
    SimpleForm,
    TextField,
    useRecordContext,
} from "react-admin";
import { Card, CardContent, IconButton, Toolbar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CustomBox, CustomGrid, GridWrapper } from "../../styles/styles";
import EditableField from "../../fields/EditableField";
import { getChoiceValue, getEnumAsChoices, getSpecialitiesAsChoices } from "../../../utils/reactAdminUtils";
import { displayCodeableConcept, displayFhirHumanName } from "../../../utils/fhirUtils";
import { AppointmentStatus } from "../../../model/fhir/Appointment/AppointmentChoices";
import { formatSchedule } from "../../../utils/dateUtils";
import AppointmentController from "../../../controllers/AppointmentController";
import ResourceDataProviderHttpClient from "../../../http/ResourceDataProviderHttpClient";

const AppointmentShowAndEditViewToolbar: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
    return (
        <Toolbar
            sx={{
                display: "flex",
                justifyContent: "space-between",
            }}>
            {isEditing && <SaveButton />}
            {isEditing && <DeleteButton mutationMode="pessimistic" />}
        </Toolbar>
    );
};

const AppointmentShowAndEditView = () => {
    const record = useRecordContext();
    const [isEditing, setIsEditing] = useState(false);
    const specialtiesValueSetMockChoices = getSpecialitiesAsChoices();

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const transform = async (data: any) => {
        return await AppointmentController.transformCreateAndEdit(data, ResourceDataProviderHttpClient.getInstance());
    };

    return (
        <Edit transform={transform} title={false} id={record?.id} mutationMode={"pessimistic"}>
            <Card>
                <CardContent>
                    <IconButton sx={{ float: "right" }} onClick={handleEditClick}>
                        <EditIcon />
                    </IconButton>
                    <SimpleForm
                        warnWhenUnsavedChanges={true}
                        toolbar={<AppointmentShowAndEditViewToolbar isEditing={isEditing} />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    <Labeled>
                                        <TextField source="id" label="ID" />
                                    </Labeled>
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
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
                                    ) : (
                                        <Labeled label="Profissional">
                                            <ReferenceField
                                                label="Profissional"
                                                source="processedPractitioner"
                                                reference="Practitioner"
                                                link="show">
                                                <FunctionField
                                                    render={(record) => {
                                                        return displayFhirHumanName(record);
                                                    }}
                                                />
                                            </ReferenceField>
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
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
                                    ) : (
                                        <Labeled label="Paciente">
                                            <ReferenceField
                                                label="Profissional"
                                                source="processedPatient"
                                                reference="Patient"
                                                link="show">
                                                <FunctionField
                                                    render={(record) => {
                                                        return displayFhirHumanName(record);
                                                    }}
                                                />
                                            </ReferenceField>
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
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
                                    ) : (
                                        <Labeled label="Slot">
                                            <ReferenceField
                                                label="Slot"
                                                source="processedSlot"
                                                reference="Slot"
                                                link="show">
                                                <FunctionField
                                                    render={(record) => {
                                                        return formatSchedule(record.start, record.end);
                                                    }}
                                                />
                                            </ReferenceField>
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
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
                                    ) : (
                                        <Labeled label="Especialidade">
                                            <FunctionField
                                                render={(record) => {
                                                    return displayCodeableConcept(record.specialty);
                                                }}
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <EditableField
                                            source="status"
                                            type="select"
                                            choices={getEnumAsChoices(AppointmentStatus)}
                                            label="Estado"
                                            isEditing={isEditing}
                                        />
                                    ) : (
                                        <Labeled label="Estado">
                                            <FunctionField
                                                render={(record) => getChoiceValue(record?.status, AppointmentStatus)}
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <EditableField
                                    source="description"
                                    type="textArea"
                                    label="Descrição"
                                    isEditing={isEditing}
                                />
                            </GridWrapper>
                        </CustomBox>
                    </SimpleForm>
                </CardContent>
            </Card>
        </Edit>
    );
};

export default AppointmentShowAndEditView;
