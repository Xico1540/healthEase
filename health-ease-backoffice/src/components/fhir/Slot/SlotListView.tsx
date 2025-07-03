import * as React from "react";
import {
    AutocompleteInput,
    BulkDeleteButton,
    Datagrid,
    DateField,
    FunctionField,
    List,
    ReferenceField,
    ReferenceInput,
    SelectField,
} from "react-admin";
import SlotShowAndEditView from "./SlotShowAndEditView";
import { getEnumAsChoices } from "../../../utils/reactAdminUtils";
import { SlotStatus } from "../../../model/fhir/Slot/SlotChoices";
import { formatSchedule, formatTime } from "../../../utils/dateUtils";

const slotFilters = [
    <ReferenceInput
        key="schedule"
        source="schedule"
        reference="Schedule"
        label="Agenda"
        filterToQuery={(searchText: string) => ({ name: searchText })}>
        <AutocompleteInput
            label="Agenda"
            optionText={(record) => formatSchedule(record.planningHorizon.start, record.planningHorizon.end)}
        />
    </ReferenceInput>,
];

const SlotListView: React.FC = () => {
    return (
        <List title="Slot" filters={slotFilters}>
            <Datagrid
                rowClick="expand"
                expand={<SlotShowAndEditView />}
                bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}>
                <ReferenceField label="Agenda" source="processedScheduleId" reference="Schedule" link="show">
                    <FunctionField
                        render={(record) => {
                            return formatSchedule(record.planningHorizon.start, record.planningHorizon.end);
                        }}
                    />
                </ReferenceField>
                <SelectField source="status" label="Status" choices={getEnumAsChoices(SlotStatus)} />
                <FunctionField
                    label="Início"
                    render={(record) => formatTime(record.start, { hour: "2-digit", minute: "2-digit" })}
                />
                <FunctionField
                    label="Fim"
                    render={(record) => formatTime(record.end, { hour: "2-digit", minute: "2-digit" })}
                />
            </Datagrid>
        </List>
    );
};

export default SlotListView;
