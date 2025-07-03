import * as React from "react";
import { AutocompleteArrayInput, BooleanInput, Create, SaveButton, SimpleForm, TextInput, Toolbar } from "react-admin";
import { Card, CardContent } from "@mui/material";
import { CustomBox, CustomGrid, GridWrapper } from "../../styles/styles";
import { getEnumAsChoices } from "../../../utils/reactAdminUtils";
import { OrganizationTypes } from "../../../model/fhir/Organization/OrganizationChoices";
import OrganizationController from "../../../controllers/OrganizationController";

const OrganizationCreateViewToolbar: React.FC = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

const OrganizationCreateView: React.FC = () => {
    return (
        <Create transform={OrganizationController.transformCreate}>
            <Card>
                <CardContent>
                    <SimpleForm toolbar={<OrganizationCreateViewToolbar />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    <TextInput source="name" label="Nome" />
                                </CustomGrid>
                                <CustomGrid>
                                    <AutocompleteArrayInput
                                        source="type"
                                        choices={getEnumAsChoices(OrganizationTypes)}
                                        label="Tipos"
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="telecom[0].value" label="Contacto" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="telecom[1].value" label="Email" />
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

export default OrganizationCreateView;
