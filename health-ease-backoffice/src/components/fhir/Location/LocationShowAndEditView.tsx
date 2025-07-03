import * as React from "react";
import { useState } from "react";
import {
    Edit,
    SaveButton,
    DeleteButton,
    SimpleForm,
    useRecordContext,
    TextField,
    Labeled,
    FunctionField,
    AutocompleteArrayInput,
    AutocompleteInput,
    ReferenceField,
    ReferenceInput,
} from "react-admin";
import { Card, CardContent, IconButton, Toolbar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CustomBox, CustomGrid, GridWrapper } from "../../styles/styles";
import EditableField from "../../fields/EditableField";
import { getCodeCodableConcept, getCodeCodeableConceptList } from "../../../utils/fhirUtils";
import { LocationPhysicalTypes, LocationStatus, LocationTypes } from "../../../model/fhir/Location/LocationChoices";
import { getChoiceValue, getEnumAsChoices } from "../../../utils/reactAdminUtils";
import LocationController from "../../../controllers/LocationController";

const LocationShowAndEditViewToolbar: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
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

const LocationShowAndEditView = () => {
    const record = useRecordContext();
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    return (
        <Edit transform={LocationController.transformEdit} title={false} id={record?.id} mutationMode={"pessimistic"}>
            <Card>
                <CardContent>
                    <IconButton sx={{ float: "right" }} onClick={handleEditClick}>
                        <EditIcon />
                    </IconButton>
                    <SimpleForm
                        warnWhenUnsavedChanges={true}
                        toolbar={<LocationShowAndEditViewToolbar isEditing={isEditing} />}>
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
                                        <EditableField
                                            source="status"
                                            type="select"
                                            choices={getEnumAsChoices(LocationStatus)}
                                            label="Estado"
                                            isEditing={isEditing}
                                        />
                                    ) : (
                                        <Labeled label="Estado">
                                            <FunctionField
                                                render={(record) => getChoiceValue(record?.status, LocationStatus)}
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField
                                        source="description"
                                        label="Descrição"
                                        isEditing={isEditing}
                                        multiline
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="mode" label="Modo" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <AutocompleteArrayInput
                                            label="Tipos"
                                            source="processedType"
                                            choices={getEnumAsChoices(LocationTypes)}
                                        />
                                    ) : (
                                        <Labeled label="Tipos">
                                            <FunctionField
                                                label="Tipos"
                                                render={(record) =>
                                                    getCodeCodeableConceptList(record?.type, LocationTypes)
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
                                    <EditableField source="address.line[0]" label="Rua" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="address.city" label="Cidade" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="address.state" label="Estado" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="address.postalCode" label="Codigo-Postal" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <AutocompleteInput
                                            label="Tipo fisico"
                                            source="processedPhysicalType"
                                            choices={getEnumAsChoices(LocationPhysicalTypes)}
                                        />
                                    ) : (
                                        <>
                                            <Labeled label="Tipo fisico">
                                                <FunctionField
                                                    render={(record) =>
                                                        getCodeCodableConcept(
                                                            record?.physicalType,
                                                            LocationPhysicalTypes,
                                                        )
                                                    }
                                                />
                                            </Labeled>
                                        </>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField
                                        source="position.latitude"
                                        label="Localização latitude"
                                        isEditing={isEditing}
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField
                                        source="position.longitude"
                                        label="Localização longitude"
                                        isEditing={isEditing}
                                    />
                                </CustomGrid>
                                {isEditing ? (
                                    <ReferenceInput
                                        source="processedOrganizationId"
                                        reference="Organization"
                                        label="Organização"
                                        filterToQuery={(searchText: string) => ({ name: searchText })}>
                                        <AutocompleteInput optionText="name" />
                                    </ReferenceInput>
                                ) : (
                                    <Labeled label="Organização">
                                        <ReferenceField
                                            label="Organização"
                                            source="processedOrganizationId"
                                            reference="Organization"
                                            link="show"
                                        />
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

export default LocationShowAndEditView;
