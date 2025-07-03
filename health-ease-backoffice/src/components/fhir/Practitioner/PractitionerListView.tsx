import { BulkDeleteButton, DatagridConfigurable, EmailField, List, TextField, TextInput } from "react-admin";
import React from "react";
import PractitionerShowAndEditView from "./PractitionerShowAndEditView";
import NameWithAvatar from "../../fields/NamewithAvatar";
import StatusChipField from "../../fields/StatusChipField";

const patientFilters = [
    <TextInput key="title" label="Nome" source="name" />,
    <TextInput key="title" label="Especialidade" source="specialty" />,
    <TextInput key="phone/email" label="Telefone/Email" source="telecom" />,
    <TextInput key="Morada" label="Morada" source="address" />,
];

const PractitionerListView: React.FC = () => {
    return (
        <List title="Profissionais" filters={patientFilters}>
            <DatagridConfigurable
                rowClick="expand"
                expand={<PractitionerShowAndEditView />}
                bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}>
                <NameWithAvatar source="name" label={"Nome"} />
                <TextField source="telecom[0].value" label={"Contacto"} />
                <EmailField source="telecom[1].value" label={"Email"} />
                <StatusChipField source="active" label="Ativo" />
            </DatagridConfigurable>
        </List>
    );
};

export default PractitionerListView;
