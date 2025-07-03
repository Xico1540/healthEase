import * as React from "react";
import { useState } from "react";
import {
    DeleteButton,
    Edit,
    SaveButton,
    SimpleForm,
    useRecordContext,
    Labeled,
    TextField,
    AutocompleteArrayInput,
    FunctionField,
} from "react-admin";
import { Card, CardContent, IconButton, Toolbar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CustomBox, CustomGrid, GridWrapper } from "../../styles/styles";
import EditableField from "../../fields/EditableField";
import OrganizationController from "../../../controllers/OrganizationController";
import { getChoiceValue, getEnumAsChoices } from "../../../utils/reactAdminUtils";
import { OrganizationActive, OrganizationTypes } from "../../../model/fhir/Organization/OrganizationChoices";
import { getCodeCodeableConceptList } from "../../../utils/fhirUtils";

const OrganizationShowAndEditViewToolbar: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
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

const OrganizationShowAndEditView = () => {
    const record = useRecordContext();
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    return (
        <Edit
            transform={OrganizationController.transformEdit}
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
                        toolbar={<OrganizationShowAndEditViewToolbar isEditing={isEditing} />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    <Labeled>
                                        <TextField source="id" label="ID" />
                                    </Labeled>
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="name" label="Nome" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <AutocompleteArrayInput
                                            label="Tipos"
                                            source="processedType"
                                            choices={getEnumAsChoices(OrganizationTypes)}
                                        />
                                    ) : (
                                        <Labeled label="Tipos">
                                            <FunctionField
                                                label="Type"
                                                render={(record) =>
                                                    getCodeCodeableConceptList(record?.type, OrganizationTypes)
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
                                    <EditableField source="address[0].line[0]" label="Rua" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="address[0].city" label="Cidade" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField
                                        source="address[0].postalCode"
                                        label="Codigo-Postal"
                                        isEditing={isEditing}
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <EditableField
                                            source="active"
                                            type="boolean"
                                            choices={getEnumAsChoices(OrganizationActive)}
                                            label="Ativo"
                                            isEditing={isEditing}
                                        />
                                    ) : (
                                        <Labeled label="Ativo">
                                            <FunctionField
                                                render={(record) => getChoiceValue(record?.active, OrganizationActive)}
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

export default OrganizationShowAndEditView;
