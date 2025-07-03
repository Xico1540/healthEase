import * as React from "react";
import { useState } from "react";
import {
    DeleteButton,
    Edit,
    FunctionField,
    Labeled,
    SaveButton,
    SimpleForm,
    TextField,
    useNotify,
    useRecordContext,
} from "react-admin";
import { Card, CardContent, IconButton, Toolbar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CustomBox, CustomGrid, GridWrapper } from "../../styles/styles";
import EditableField from "../../fields/EditableField";
import { Gender } from "../../../model/fhir/FhirDataTypes";
import { getChoiceValue, getEnumAsChoices } from "../../../utils/reactAdminUtils";
import { PractitionerActive } from "../../../model/fhir/Practitioner/PractitionerChoices";
import { Add, SaveOutlined, SupervisedUserCircle, SupervisedUserCircleSharp } from "@mui/icons-material";
import UsersService from "../../../services/UsersService";
import { HttpError } from "../../../model/Authentication";

const PractitionerShowAndEditViewToolbar: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
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

const PractitionerShowAndEditView = () => {
    const record = useRecordContext();
    const [isEditing, setIsEditing] = useState(false);
    const usersService: UsersService = UsersService.getInstance();
    const notify = useNotify();

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleCreateAccount = () => {
        usersService
            .createPractitionerUser({
                id: record?.id.toString(),
                email: record?.telecom[1].value,
                role: 1,
            })
            .then(() => {
                notify("Conta criada com sucesso", { type: "success" });
            })
            .catch((error: HttpError) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 409:
                            notify("Já existe uma conta associada a este profissional.", { type: "warning" });
                            break;
                        case 400:
                            notify("Dados inválidos. Verifique as informações enviadas.", { type: "error" });
                            break;
                        default:
                            notify("Erro ao criar a conta do profissional. Tente novamente mais tarde.", { type: "error" });
                    }
                } else {
                    notify("Erro inesperado. Verifique sua conexão ou tente novamente.", { type: "error" });
                }
                console.error(error);
            });
    };

    return (
        <Edit title={false} id={record?.id} mutationMode={"pessimistic"}>
            <Card>
                <CardContent>
                    <IconButton sx={{ float: "right" }} onClick={handleEditClick}>
                        <EditIcon />
                    </IconButton>
                    <IconButton sx={{ float: "right" }} onClick={handleCreateAccount}>
                        <SupervisedUserCircleSharp />
                    </IconButton>
                    <SimpleForm
                        warnWhenUnsavedChanges={true}
                        toolbar={<PractitionerShowAndEditViewToolbar isEditing={isEditing} />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    <Labeled>
                                        <TextField source="id" label="ID" />
                                    </Labeled>
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
                                    <EditableField source="telecom[0].value" label="Contacto" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    <EditableField source="telecom[1].value" label="Email" isEditing={isEditing} />
                                </CustomGrid>
                                <CustomGrid>
                                    {isEditing ? (
                                        <EditableField
                                            source="active"
                                            type="boolean"
                                            choices={getEnumAsChoices(PractitionerActive)}
                                            label="Ativo"
                                            isEditing={isEditing}
                                        />
                                    ) : (
                                        <Labeled label="Ativo">
                                            <FunctionField
                                                render={(record) => getChoiceValue(record?.active, PractitionerActive)}
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

export default PractitionerShowAndEditView;
