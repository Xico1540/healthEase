import * as React from "react";
import { BooleanInput, Create, DateInput, SaveButton, SelectInput, SimpleForm, TextInput, Toolbar } from "react-admin";
import { Card, CardContent } from "@mui/material";
import { CustomBox, CustomGrid, GridWrapper } from "../../styles/styles";
import { getEnumAsChoices } from "../../../utils/reactAdminUtils";
import { Gender } from "../../../model/fhir/FhirDataTypes";
import { PatientController } from "../../../controllers/PatientController";

const PatientCreateViewToolbar: React.FC = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

const PatientCreateView: React.FC = () => {
    return (
        <Create transform={PatientController.transformCreate}>
            <Card>
                <CardContent>
                    <SimpleForm toolbar={<PatientCreateViewToolbar />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    <TextInput source="name[0].given" label="Primeiro Nome" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="name[0].family" label="Ultimo Nome" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput type="numeric" source="snsIdentifier" label="SNS" />
                                </CustomGrid>
                                <CustomGrid>
                                    <SelectInput source="gender" label="Género" choices={getEnumAsChoices(Gender)} />
                                </CustomGrid>
                                <CustomGrid>
                                    <DateInput source="birthDate" label="Data de Nascimento" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="address[0].line[0]" label="Rua" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="address[0].city" label="Cidade" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="address[0].postalCode" label="Codigo-Postal" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="contact[0].name.given[0]" label="Primeiro Nome Contacto" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="contact[0].name.family" label="Ultimo Nome Contacto" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="telecom[0].value" label="Email" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="telecom[1].value" label="Contacto" />
                                </CustomGrid>
                                <CustomGrid>
                                    <BooleanInput source="active" label="Ativo" />
                                </CustomGrid>
                            </GridWrapper>
                        </CustomBox>
                    </SimpleForm>
                </CardContent>
            </Card>
        </Create>
    );
};

export default PatientCreateView;
