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
    useNotify,
} from "react-admin";
import { Card, CardContent, IconButton, Toolbar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CustomBox, CustomGrid, GridWrapper } from "../../styles/styles";
import EditableField from "../../fields/EditableField";
import { getChoiceValue, getEnumAsChoices } from "../../../utils/reactAdminUtils";
import { Gender } from "../../../model/fhir/FhirDataTypes";
import { PatientActive } from "../../../model/fhir/Patient/PatientChoices";
import { SaveOutlined } from "@mui/icons-material";
import AuthService from "../../../services/AuthService";

const PatientShowAndEditViewToolbar: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
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

const PatientShowAndEditView = () => {
    const record = useRecordContext();
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    return (
        <Edit title={false} id={record?.id} mutationMode={"pessimistic"}>
            <Card>
                <CardContent>
                    <IconButton sx={{ float: "right" }} onClick={handleEditClick}>
                        <EditIcon />
                    </IconButton>

                    <SimpleForm
                        warnWhenUnsavedChanges={true}
                        toolbar={<PatientShowAndEditViewToolbar isEditing={isEditing} />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    <Labeled>
                                        <TextField source="id" label="ID" />
                                    </Labeled>
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="identifier[0].value" label="SNS" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="name[0].given" label="Primeiro Nome" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="name[0].family" label="Ultimo Nome" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <EditableField
                                            source="gender"
                                            label="Género"
                                            isEditing={isEditing}
                                            type="select"
                                            choices={getEnumAsChoices(Gender)}
                                        />
                                    ) : (
                                        <Labeled label="Género">
                                            <FunctionField
                                                render={(record) => getChoiceValue(record?.gender, Gender)}
                                            />
                                        </Labeled>
                                    )}
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField
                                        source="birthDate"
                                        label="Data de Nascimento"
                                        isEditing={isEditing}
                                        type="date"
                                    />
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
                                    <EditableField
                                        source="contact[0].name.given[0]"
                                        label="Primeiro Nome Contacto"
                                        isEditing={isEditing}
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField
                                        source="contact[0].name.family"
                                        label="Ultimo Nome Contacto"
                                        isEditing={isEditing}
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="telecom[0].value" label="Email" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="telecom[1].value" label="Contacto" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <EditableField
                                            source="active"
                                            type="boolean"
                                            choices={getEnumAsChoices(PatientActive)}
                                            label="Ativo"
                                            isEditing={isEditing}
                                        />
                                    ) : (
                                        <Labeled label="Ativo">
                                            <FunctionField
                                                render={(record) => getChoiceValue(record?.active, PatientActive)}
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

export default PatientShowAndEditView;
