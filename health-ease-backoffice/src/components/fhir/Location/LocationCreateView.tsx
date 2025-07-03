import * as React from "react";
import {
    AutocompleteArrayInput,
    AutocompleteInput,
    Create,
    ReferenceInput,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
} from "react-admin";
import { Card, CardContent } from "@mui/material";
import { CustomBox, CustomGrid, GridWrapper } from "../../styles/styles";
import LocationController from "../../../controllers/LocationController";
import { getEnumAsChoices } from "../../../utils/reactAdminUtils";
import { LocationPhysicalTypes, LocationStatus, LocationTypes } from "../../../model/fhir/Location/LocationChoices";

const LocationCreateViewToolbar: React.FC = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

const LocationCreateView: React.FC = () => {
    return (
        <Create transform={LocationController.transformCreate}>
            <Card>
                <CardContent>
                    <SimpleForm toolbar={<LocationCreateViewToolbar />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    <TextInput source="name" label="Nome" />
                                </CustomGrid>
                                <CustomGrid>
                                    <SelectInput
                                        source="status"
                                        label="Estado"
                                        choices={getEnumAsChoices(LocationStatus)}
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="description" label="Descrição" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="mode" label="Modo" />
                                </CustomGrid>
                                <AutocompleteArrayInput
                                    source="type"
                                    choices={getEnumAsChoices(LocationTypes)}
                                    label="Tipos"
                                />
                                <CustomGrid>
                                    <TextInput source="telecom[0].value" label="Contacto" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="telecom[1].value" label="Email" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="address.line[0]" label="Rua" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="address.city" label="Cidade" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="address.state" label="Estado" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="address.postalCode" label="Codigo-Postal" />
                                </CustomGrid>
                                <CustomGrid>
                                    <AutocompleteInput
                                        label="Tipo fisico"
                                        source="physicalType"
                                        choices={getEnumAsChoices(LocationPhysicalTypes)}
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="position.latitude" label="Localização latitude" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="position.longitude" label="Localização longitude" />
                                </CustomGrid>
                                <ReferenceInput
                                    source="managingOrganization"
                                    reference="Organization"
                                    label="Organização"
                                />
                            </GridWrapper>
                        </CustomBox>
                    </SimpleForm>
                </CardContent>
            </Card>
        </Create>
    );
};

export default LocationCreateView;
