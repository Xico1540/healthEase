import * as React from "react";
import { useState } from "react";
import {
    ArrayInput,
    AutocompleteArrayInput,
    AutocompleteInput,
    DeleteButton,
    Edit,
    FunctionField,
    Labeled,
    ReferenceArrayInput,
    ReferenceField,
    ReferenceInput,
    SaveButton,
    SimpleForm,
    SimpleFormIterator,
    TimeInput,
    useRecordContext,
} from "react-admin";
import { Card, CardContent, IconButton, Toolbar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getChoiceValue, getEnumAsChoices, getSpecialitiesAsChoices } from "../../../utils/reactAdminUtils";
import { DaysOfWeek, PractitionerRoleActive } from "../../../model/fhir/PractitionerRole/PractitionerRoleChoices";
import PractitionerRoleController from "../../../controllers/PractitionerRoleController";
import { CustomBox, CustomGrid, GridWrapper } from "../../styles/styles";
import EditableField from "../../fields/EditableField";
import { displayCodeableConcept, displayFhirHumanName } from "../../../utils/fhirUtils";
import Table from "../../fields/TableField";

const PractitionerRoleShowAndEditViewToolbar: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
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

const PractitionerRoleShowAndEditView: React.FC = () => {
    const record = useRecordContext();
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };
    const specialtiesValueSetMockChoices = getSpecialitiesAsChoices();

    return (
        <Edit
            transform={PractitionerRoleController.transformEdit}
            title={false}
            id={record?.id}
            mutationMode={"pessimistic"}>
            <Card>
                <CardContent>
                    <IconButton sx={{ float: "right" }} onClick={handleEditClick}>
                        <EditIcon />
                    </IconButton>
                    <SimpleForm
                        warnWhenUnsavedChanges={true}
                        toolbar={<PractitionerRoleShowAndEditViewToolbar isEditing={isEditing} />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    {isEditing ? (
                                        <EditableField
                                            source="active"
                                            type="boolean"
                                            choices={getEnumAsChoices(PractitionerRoleActive)}
                                            label="Ativo"
                                            isEditing={isEditing}
                                        />
                                    ) : (
                                        <Labeled label="Ativo">
                                            <FunctionField
                                                render={(record) =>
                                                    getChoiceValue(record?.active, PractitionerRoleActive)
                                                }
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <ReferenceInput
                                            source="processedPractitioner"
                                            reference="Practitioner"
                                            label="Profissional"
                                            filterToQuery={(searchText: string) => ({ name: searchText })}>
                                            <AutocompleteInput
                                                optionText={(record) =>
                                                    `${record.name[0].given} ${record.name[0].family}`
                                                }
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
                                            source="processedOrganization"
                                            reference="Organization"
                                            label="Organização"
                                            filterToQuery={(searchText: string) => ({ name: searchText })}>
                                            <AutocompleteInput optionText="name" />
                                        </ReferenceInput>
                                    ) : (
                                        <Labeled label="Organização">
                                            <ReferenceField
                                                label="Organização"
                                                source="processedOrganization"
                                                reference="Organization"
                                                link="show"
                                            />
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
                                        <ReferenceArrayInput
                                            source="processedLocation"
                                            reference="Location"
                                            label="Localização"
                                            filterToQuery={(searchText: string) => ({ name: searchText })}>
                                            <AutocompleteArrayInput optionText="name" />
                                        </ReferenceArrayInput>
                                    ) : (
                                        <Labeled label="Localização">
                                            <FunctionField
                                                render={(record) =>
                                                    record?.processedLocation ? (
                                                        <Table
                                                            data={record.processedLocation}
                                                            reference="Location"
                                                            displayField="name"
                                                        />
                                                    ) : null
                                                }
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="telecom[0].value" label="Contacto" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="telecom[1].value" label="Email" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <ArrayInput source="processedAvailableTime">
                                            <SimpleFormIterator>
                                                <AutocompleteArrayInput
                                                    source="daysOfWeek"
                                                    label="Dias da Semana"
                                                    choices={getEnumAsChoices(DaysOfWeek)}
                                                />
                                                <TimeInput source="availableStartTime" label="Hora de Início" />
                                                <TimeInput source="availableEndTime" label="Hora de Término" />
                                            </SimpleFormIterator>
                                        </ArrayInput>
                                    ) : (
                                        <Labeled label="Horário Disponível">
                                            <FunctionField
                                                render={(record) =>
                                                    record?.availableTime?.map((time: any) => {
                                                        const daysOfWeekInPortuguese = time.daysOfWeek
                                                            ? (time.daysOfWeek as Array<keyof typeof DaysOfWeek>)
                                                                  .map((day) => DaysOfWeek[day])
                                                                  .join(", ")
                                                            : "";
                                                        return (
                                                            <div
                                                                key={`${time.daysOfWeek?.join(",")}-${time.availableStartTime}-${time.availableEndTime}`}>
                                                                {daysOfWeekInPortuguese} : {time.availableStartTime} -{" "}
                                                                {time.availableEndTime}
                                                            </div>
                                                        );
                                                    }) || null
                                                }
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                            </GridWrapper>
                        </CustomBox>
                    </SimpleForm>
                </CardContent>
            </Card>
        </Edit>
    );
};

export default PractitionerRoleShowAndEditView;
