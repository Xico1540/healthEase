import * as React from "react";
import { SimpleForm, TextInput, BooleanInput, DateInput, SelectInput, SaveButton, Toolbar, Create } from "react-admin";
import { Card, CardContent } from "@mui/material";
import { GridWrapper, CustomGrid, CustomBox } from "../../styles/styles";
import { Gender } from "../../../model/fhir/FhirDataTypes";
import { getEnumAsChoices } from "../../../utils/reactAdminUtils";

const PractitionerCreateViewToolbar: React.FC = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

const PractitionerCreateView: React.FC = () => {
    return (
        <Create>
            <Card>
                <CardContent>
                    <SimpleForm toolbar={<PractitionerCreateViewToolbar />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    <TextInput source="name[0].given" label="Primeiro Nome" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="name[0].family" label="Ultimo Nome" />
                                </CustomGrid>
                                <CustomGrid>
                                    <SelectInput source="gender" label="Genero" choices={getEnumAsChoices(Gender)} />
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
                                    <TextInput source="telecom[0].value" label="Contacto" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="telecom[1].value" label="Email" />
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

export default PractitionerCreateView;
