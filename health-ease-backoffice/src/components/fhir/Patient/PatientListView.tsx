import * as React from "react";
import { BulkDeleteButton, Datagrid, List, TextField, TextInput, EmailField } from "react-admin";
import PatientShowAndEditView from "./PatientShowAndEditView";
import NameWithAvatar from "../../fields/NamewithAvatar";
import StatusChipField from "../../fields/StatusChipField";

const patientFilters = [
    <TextInput key="title" label="Nome" source="name" />,
    <TextInput key="phone/email" label="Telefone/Email" source="telecom" />,
    <TextInput key="Morada" label="Morada" source="address" />,
];

const PatientListView: React.FC = () => {
    return (
        <List title="Utentes" filters={patientFilters}>
            <Datagrid
                rowClick="expand"
                expand={<PatientShowAndEditView />}
                bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}>
                <NameWithAvatar source="name" label="Nome" />
                <TextField source="identifier[0].value" label={"SNS"} />
                <EmailField source="telecom[0].value" label={"Email"} />
                <TextField source="telecom[1].value" label={"Contacto"} />
                <StatusChipField source="active" label="Ativo" />
            </Datagrid>
        </List>
    );
};

export default PatientListView;
