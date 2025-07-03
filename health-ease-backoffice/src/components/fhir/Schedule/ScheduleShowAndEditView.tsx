import * as React from "react";
import { useState } from "react";
import {
    ArrayInput,
    AutocompleteArrayInput,
    AutocompleteInput,
    DateInput,
    DeleteButton,
    Edit,
    FunctionField,
    Labeled,
    ReferenceInput,
    SaveButton,
    SimpleForm,
    SimpleFormIterator,
    TimeInput,
    useRecordContext,
} from "react-admin";
import { Card, CardContent, IconButton, Toolbar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import valueSetRolesMock from "../../../mockData/valueSets/SpecialtiesMock";
import ScheduleController from "../../../controllers/ScheduleController";
import { CustomBox, CustomGrid, GridWrapper } from "../../styles/styles";
import EditableField from "../../fields/EditableField";
import { displayPractitionerName } from "../../../utils/fhirUtils";
import { formatDate, formatTime, optionsDate, optionsTime } from "../../../utils/dateUtils";
import { ActorName } from "../../fields/ActornNameWithAvatar";
import {
    getServiceTypesFromEnum,
    ScheduleServiceCategory,
    ScheduleServiceType,
} from "../../../model/fhir/Schedule/ScheduleChoices";

const ScheduleShowAndEditViewToolbar: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
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

const ScheduleShowAndEditView: React.FC = () => {
    const record = useRecordContext();
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const serviceTypes = getServiceTypesFromEnum(ScheduleServiceType);

    const serviceCategories = getServiceTypesFromEnum(ScheduleServiceCategory);

    const specialties = valueSetRolesMock.compose.include[0].concept.map((item: { code: string; display: string }) => ({
        id: item.code,
        name: item.display,
    }));

    return (
        <Edit transform={ScheduleController.transformEdit} title={false} id={record?.id} mutationMode={"pessimistic"}>
            <Card>
                <CardContent>
                    <IconButton sx={{ float: "right" }} onClick={handleEditClick}>
                        <EditIcon />
                    </IconButton>
                    <SimpleForm
                        warnWhenUnsavedChanges={true}
                        toolbar={<ScheduleShowAndEditViewToolbar isEditing={isEditing} />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    {isEditing ? (
                                        <ReferenceInput
                                            source="actor"
                                            reference="Practitioner"
                                            label="Profissional"
                                            filterToQuery={(searchText: string) => ({ name: searchText })}
                                            defaultValue={{
                                                reference: `Practitioner/${record?.actor?.[0]?.id}`,
                                                display: displayPractitionerName(record?.actor?.[0]),
                                            }}>
                                            <AutocompleteInput optionText={displayPractitionerName} />
                                        </ReferenceInput>
                                    ) : (
                                        <Labeled label="Practitioner">
                                            <FunctionField
                                                render={(record) =>
                                                    record.actor?.[0]?.reference ? (
                                                        <ActorName reference={record.actor?.[0]?.reference} />
                                                    ) : (
                                                        "N/A"
                                                    )
                                                }
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <AutocompleteArrayInput
                                            source="processedServiceType"
                                            label="Service Type"
                                            choices={serviceTypes}
                                            defaultValue={record?.processedServiceType}
                                        />
                                    ) : (
                                        <Labeled label="Service Type">
                                            <FunctionField
                                                render={(record) => {
                                                    if (!record?.serviceType?.[0]?.coding?.[0]?.code) return "N/A";
                                                    const serviceTypeId = record.serviceType[0].coding[0].code;
                                                    const serviceType = serviceTypes.find(
                                                        (item) => item.id === serviceTypeId,
                                                    );
                                                    return serviceType?.name || "N/A";
                                                }}
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <AutocompleteArrayInput
                                            source="processedSpecialty"
                                            label="Especialidade"
                                            choices={specialties}
                                            defaultValue={record?.processedSpecialty}
                                        />
                                    ) : (
                                        <Labeled label="Especialidade">
                                            <FunctionField
                                                render={(record) => {
                                                    if (!record?.specialty?.[0]?.text) return "N/A";
                                                    const specialtyId = record.specialty[0].text;
                                                    const specialty = valueSetRolesMock.compose.include[0].concept.find(
                                                        (item) => item.code === specialtyId,
                                                    );
                                                    return specialty?.display || "N/A";
                                                }}
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>

                                <CustomGrid>
                                    {isEditing ? (
                                        <AutocompleteArrayInput
                                            source="processedServiceCategory"
                                            label="Service Category"
                                            choices={serviceCategories}
                                            defaultValue={record?.processedServiceCategory}
                                        />
                                    ) : (
                                        <Labeled label="Service Category">
                                            <FunctionField
                                                render={(record) => {
                                                    if (!record?.serviceCategory?.[0]?.coding?.[0]?.code) return "N/A";
                                                    const serviceCategoryId = record.serviceCategory[0].coding[0].code;
                                                    const serviceCategory = serviceCategories.find(
                                                        (item) => item.id === serviceCategoryId,
                                                    );
                                                    return serviceCategory?.name || "N/A";
                                                }}
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <ArrayInput source="planningHorizon">
                                            <SimpleFormIterator>
                                                <DateInput
                                                    source="start"
                                                    label="Dia de Início"
                                                    defaultValue={record?.planningHorizon?.start}
                                                />
                                            </SimpleFormIterator>
                                        </ArrayInput>
                                    ) : (
                                        <Labeled label="Dia Planeado">
                                            <FunctionField
                                                render={(record) => {
                                                    const start = record.planningHorizon?.start;
                                                    return formatDate(start, optionsDate);
                                                }}
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <ArrayInput source="planningHorizon">
                                            <SimpleFormIterator>
                                                <TimeInput
                                                    source="start"
                                                    label="Hora de Início"
                                                    defaultValue={record?.planningHorizon?.start}
                                                />
                                                <TimeInput
                                                    source="end"
                                                    label="Hora de Término"
                                                    defaultValue={record?.planningHorizon?.end}
                                                />
                                            </SimpleFormIterator>
                                        </ArrayInput>
                                    ) : (
                                        <Labeled label="Horário Planeado">
                                            <FunctionField
                                                render={(record) => {
                                                    const start = record.planningHorizon?.start;
                                                    const end = record.planningHorizon?.end;
                                                    return start && end
                                                        ? `${formatTime(start, optionsTime)} - ${formatTime(end, optionsTime)}`
                                                        : "N/A";
                                                }}
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>

                                <CustomGrid>
                                    {isEditing ? (
                                        <AutocompleteInput
                                            source="active"
                                            label="Ativo"
                                            choices={[
                                                { id: true, name: "Sim" },
                                                { id: false, name: "Não" },
                                            ]}
                                        />
                                    ) : (
                                        <Labeled label="Ativo">
                                            <FunctionField render={(record) => (record?.active ? "Sim" : "Não")} />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <EditableField source="comment" label="Comentário" isEditing={isEditing} />
                                    ) : (
                                        <Labeled label="Comentário">
                                            <FunctionField render={(record) => record?.comment || "N/A"} />
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

export default ScheduleShowAndEditView;
