import * as React from "react";
import {
    AutocompleteArrayInput,
    AutocompleteInput,
    BulkDeleteButton,
    Datagrid,
    FunctionField,
    List,
    ReferenceField,
    ReferenceInput,
    TextField,
} from "react-admin";
import AppointmentShowAndEditView from "./AppointmentShowAndEditView";
import { displayFhirHumanName } from "../../../utils/fhirUtils";
import { AppointmentStatus } from "../../../model/fhir/Appointment/AppointmentChoices";
import { getChoiceValue, getEnumAsChoices, getSpecialitiesAsChoices } from "../../../utils/reactAdminUtils";
import { formatSchedule } from "../../../utils/dateUtils";
import EditableField from "../../fields/EditableField";

const specialtiesValueSetMockChoices = getSpecialitiesAsChoices();

const appointmentFilters = [
    <ReferenceInput
        key="practitioner"
        source="participant"
        reference="Practitioner"
        label="Profissional"
        filterToQuery={(searchText: string) => ({ name: searchText })}>
        <AutocompleteInput label="Profissional" optionText={(record) => displayFhirHumanName(record)} />
    </ReferenceInput>,
    <ReferenceInput
        key="patient"
        source="participant"
        reference="Patient"
        label="Patient"
        filterToQuery={(searchText: string) => ({ name: searchText })}>
        <AutocompleteInput label="Patient" optionText={(record) => displayFhirHumanName(record)} />
    </ReferenceInput>,
    <ReferenceInput
        key="slot"
        source="slot"
        reference="Slot"
        label="Slot"
        filterToQuery={(searchText: string) => ({ name: searchText })}>
        <AutocompleteInput label="Slot" optionText={(record) => formatSchedule(record.start, record.end)} />
    </ReferenceInput>,
    <EditableField
        key="status"
        source="status"
        type="select"
        choices={getEnumAsChoices(AppointmentStatus)}
        label="Estado"
        isEditing={true}
    />,
    <AutocompleteArrayInput
        key="specialty"
        source="specialty"
        label="Especialidade"
        choices={specialtiesValueSetMockChoices}
        optionText="display"
        optionValue="code"
    />,
];

const AppointmentListView: React.FC = () => {
    return (
        <List title="Marcações" filters={appointmentFilters}>
            <Datagrid
                rowClick="expand"
                expand={<AppointmentShowAndEditView />}
                bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}>
                <ReferenceField
                    label="Profissional"
                    source="processedPractitioner"
                    reference="Practitioner"
                    link="show">
                    <FunctionField render={displayFhirHumanName} />
                </ReferenceField>
                <ReferenceField label="Paciente" source="processedPatient" reference="Patient" link="show">
                    <FunctionField render={displayFhirHumanName} />
                </ReferenceField>
                <TextField source="processedSlotSchedule" label="Horário" />
                <FunctionField label="Estado" render={(record) => getChoiceValue(record?.status, AppointmentStatus)} />
            </Datagrid>
        </List>
    );
};

export default AppointmentListView;
