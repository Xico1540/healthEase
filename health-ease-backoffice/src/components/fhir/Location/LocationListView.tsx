import * as React from "react";
import {
    Datagrid,
    List,
    TextField,
    BulkDeleteButton,
    EmailField,
    TextInput,
    AutocompleteInput,
    ReferenceInput,
} from "react-admin";
import LocationShowAndEditView from "./LocationShowAndEditView";
import StatusChipField from "../../fields/StatusChipField";

const locationFilters = [
    <TextInput key="title" label="Nome" source="name" />,
    <TextInput key="phone/email" label="Telefone/Email" source="telecom" />,
    <TextInput key="Morada" label="Morada" source="address" />,
    <ReferenceInput
        key="organization"
        source="managingOrganization"
        reference="Organization"
        label="Organização"
        filterToQuery={(searchText: string) => ({ name: searchText })}>
        <AutocompleteInput label="Organização" optionText={(record) => record.name} />
    </ReferenceInput>,
];

const LocationListView: React.FC = () => {
    return (
        <List title="Localizações" filters={locationFilters}>
            <Datagrid
                rowClick="expand"
                expand={<LocationShowAndEditView />}
                bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}>
                <TextField source="name" label={"Nome"} />
                <TextField source="telecom[0].value" label={"Contacto"} />
                <EmailField source="telecom[1].value" label={"Email"} />
                <StatusChipField source="status" label="Estado" />
            </Datagrid>
        </List>
    );
};

export default LocationListView;
