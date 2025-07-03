import * as React from "react";
import {
    List,
    Datagrid,
    TextField,
    BulkDeleteButton,
    EmailField,
    FunctionField,
    ReferenceField,
    AutocompleteInput,
    ReferenceInput,
    TextInput,
} from "react-admin";
import PractitionerRoleShowAndEditView from "./PractitionerRoleShowAndEditView";
import StatusChipField from "../../fields/StatusChipField";
import { displayFhirHumanName } from "../../../utils/fhirUtils";

const practitionerRoleFilters = [
    <ReferenceInput
        key="organization"
        source="organization"
        reference="Organization"
        label="Organização"
        filterToQuery={(searchText: string) => ({ name: searchText })}>
        <AutocompleteInput label="Organização" optionText={(record) => record.name} />
    </ReferenceInput>,
    <ReferenceInput
        key="practitioner"
        source="practitioner"
        reference="Practitioner"
        label="Profissional"
        filterToQuery={(searchText: string) => ({ name: searchText })}>
        <AutocompleteInput label="Profissional" optionText={(record) => displayFhirHumanName(record)} />
    </ReferenceInput>,
    <ReferenceInput
        key="location"
        source="location"
        reference="Location"
        label="Localização"
        filterToQuery={(searchText: string) => ({ name: searchText })}>
        <AutocompleteInput label="Localização" optionText={(record) => record.name} />
    </ReferenceInput>,
    <TextInput key="phone/email" label="Telefone/Email" source="telecom" />,
];

const PractitionerRoleListView: React.FC = () => {
    return (
        <List title="Papeis" filters={practitionerRoleFilters}>
            <Datagrid
                rowClick="expand"
                expand={<PractitionerRoleShowAndEditView />}
                bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}>
                <ReferenceField
                    label="Profissional"
                    source="processedPractitioner"
                    reference="Practitioner"
                    link="show">
                    <FunctionField render={displayFhirHumanName} />
                </ReferenceField>
                <TextField source="telecom[0].value" label="Telefone" />
                <EmailField source="telecom[1].value" label={"Email"} />
                <StatusChipField source="active" label="Ativo" />
            </Datagrid>
        </List>
    );
};

export default PractitionerRoleListView;
