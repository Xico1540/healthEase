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
    Toolbar,
    useRecordContext,
} from "react-admin";
import { Card, CardContent, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getChoiceValue, getEnumAsChoices } from "../../../utils/reactAdminUtils";
import { ServiceCategoryTypes, SlotStatus } from "../../../model/fhir/Slot/SlotChoices";
import { CustomBox, CustomGrid, GridWrapper } from "../../styles/styles";
import EditableField from "../../fields/EditableField";
import { getCodeCodeableConceptList } from "../../../utils/fhirUtils";
import SlotController from "../../../controllers/SlotController";
import { formatDateTime, formatSchedule } from "../../../utils/dateUtils";

const SlotShowAndEditViewToolbar: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
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

const SlotShowAndEditView: React.FC = () => {
    const record = useRecordContext();
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    return (
        <Edit transform={SlotController.transformEdit} title={false} id={record?.id} mutationMode={"pessimistic"}>
            <Card>
                <CardContent>
                    <IconButton sx={{ float: "right" }} onClick={handleEditClick}>
                        <EditIcon />
                    </IconButton>
                    <SimpleForm
                        warnWhenUnsavedChanges={true}
                        toolbar={<SlotShowAndEditViewToolbar isEditing={isEditing} />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    {isEditing ? (
                                        <AutocompleteArrayInput
                                            label="Categoria de Serviço"
                                            source="processedserviceCategory"
                                            choices={getEnumAsChoices(ServiceCategoryTypes)}
                                        />
                                    ) : (
                                        <Labeled label="Categoria de Serviço">
                                            <FunctionField
                                                render={(record) =>
                                                    getCodeCodeableConceptList(
                                                        record?.serviceCategory,
                                                        ServiceCategoryTypes,
                                                    )
                                                }
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <EditableField
                                            source="status"
                                            label="Status"
                                            isEditing={isEditing}
                                            type="select"
                                            choices={getEnumAsChoices(SlotStatus)}
                                        />
                                    ) : (
                                        <Labeled label="Estado">
                                            <FunctionField
                                                render={(record) => getChoiceValue(record?.status, SlotStatus)}
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <EditableField
                                            source="start"
                                            label="Início"
                                            isEditing={isEditing}
                                            type="datetime"
                                        />
                                    ) : (
                                        <Labeled label="Início">
                                            <FunctionField
                                                render={(record) => formatDateTime(record.start)}
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <EditableField
                                            source="end"
                                            label="Fim"
                                            isEditing={isEditing}
                                            type="datetime"
                                        />
                                    ) : (
                                        <Labeled label="Fim">
                                            <FunctionField
                                                render={(record) => formatDateTime(record.end)}
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                {isEditing ? (
                                    <ReferenceInput
                                        source="processedScheduleId"
                                        reference="Schedule"
                                        label="Agenda"
                                        filterToQuery={(searchText: string) => ({ id: searchText })}>
                                        <AutocompleteInput optionText="id" />
                                    </ReferenceInput>
                                ) : (
                                    <Labeled label="Agenda">
                                        <ReferenceField
                                            label="Agenda"
                                            source="processedScheduleId"
                                            reference="Schedule"
                                            link="show">
                                            <FunctionField
                                                render={(record) => {
                                                    return formatSchedule(
                                                        record.planningHorizon.start,
                                                        record.planningHorizon.end,
                                                    );
                                                }}
                                            />
                                        </ReferenceField>
                                    </Labeled>
                                )}
                            </GridWrapper>
                        </CustomBox>
                    </SimpleForm>
                </CardContent>
            </Card>
        </Edit>
    );
};

export default SlotShowAndEditView;
