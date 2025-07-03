import * as React from "react";
import { Datagrid, List, TextField, BulkDeleteButton, EmailField, TextInput, SelectInput } from "react-admin";
import OrganizationShowAndEditView from "./OrganizationShowAndEditView";
import StatusChipField from "../../fields/StatusChipField";
import { getEnumAsChoices } from "../../../utils/reactAdminUtils";
import { OrganizationTypes } from "../../../model/fhir/Organization/OrganizationChoices";

const organizationFilters = [
    <TextInput key="title" label="Nome" source="name" />,
    <TextInput key="phone/email" label="Telefone/Email" source="telecom" />,
    <SelectInput key="Tipo" label="Tipo" source="type" choices={getEnumAsChoices(OrganizationTypes)} />,
];

const OrganizationListView: React.FC = () => {
    return (
        <List title="Organizações" filters={organizationFilters}>
            <Datagrid
                rowClick="expand"
                expand={<OrganizationShowAndEditView />}
                bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}>
                <TextField source="name" label={"Nome"} />
                <TextField source="telecom[0].value" label={"Contacto"} />
                <EmailField source="telecom[1].value" label={"Email"} />
                <StatusChipField source="active" label="Ativo" />
            </Datagrid>
        </List>
    );
};

export default OrganizationListView;
