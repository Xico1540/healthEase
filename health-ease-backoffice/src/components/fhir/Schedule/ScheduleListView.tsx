import React from "react";
import {
    List,
    Datagrid,
    BulkDeleteButton,
    FunctionField,
    SelectInput,
    AutocompleteArrayInput,
    ReferenceInput,
} from "react-admin";
import ScheduleShowAndEditView from "./ScheduleShowAndEditView";
import StatusChipField from "../../fields/StatusChipField";
import { optionsDate, optionsTime, formatDate, formatTime } from "../../../utils/dateUtils";
import { ActorNameWithAvatar } from "../../fields/ActornNameWithAvatar";
import { getServiceTypesFromEnum, ScheduleServiceType } from "../../../model/fhir/Schedule/ScheduleChoices";
import valueSetRolesMock from "../../../mockData/valueSets/SpecialtiesMock";

const serviceTypes = getServiceTypesFromEnum(ScheduleServiceType);
const specialties = valueSetRolesMock.compose.include[0].concept.map((item: { code: string; display: string }) => ({
    id: item.code,
    name: item.display,
}));

const scheduleFilters = [
    <AutocompleteArrayInput source="processedSpecialty" label="Specialty" choices={specialties} />,
    <AutocompleteArrayInput source="processedServiceType" label="Service Type" choices={serviceTypes} />,
    <ReferenceInput source="actor" reference="Practitioner" label="Profissional" isRequired>
        <SelectInput optionText={(record) => `${record?.name?.[0]?.given || ""} ${record?.name?.[0]?.family || ""}`} />
    </ReferenceInput>,
];

const ScheduleListView: React.FC = () => {
    return (
        <List title="Schedules" filters={scheduleFilters}>
            <Datagrid
                rowClick="expand"
                expand={<ScheduleShowAndEditView />}
                bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}>
                <FunctionField
                    label="Practitioner"
                    render={(record) =>
                        record.actor?.[0]?.reference ? (
                            <ActorNameWithAvatar reference={record.actor[0].reference} />
                        ) : (
                            "N/A"
                        )
                    }
                />
                <FunctionField
                    label="Service Type"
                    render={(record) => {
                        if (!record?.serviceType?.[0]?.coding?.[0]?.code) return "N/A";
                        const serviceTypeId = record.serviceType[0].coding[0].code;
                        const serviceType = serviceTypes.find((item) => item.id === serviceTypeId);
                        return serviceType?.name || "N/A";
                    }}
                />

                <FunctionField
                    source="processedSpecialty"
                    label="Specialty"
                    render={(record) => {
                        if (!record?.specialty?.length) return "N/A";
                        const specialtyId = record.specialty[0].text;
                        const specialty = valueSetRolesMock.compose.include[0].concept.find(
                            (item) => item.code === specialtyId,
                        );
                        return specialty?.display || "N/A";
                    }}
                />

                <FunctionField
                    label="Date"
                    render={(record) =>
                        record?.planningHorizon?.start ? formatDate(record.planningHorizon.start, optionsDate) : "N/A"
                    }
                />
                <FunctionField
                    label="Time"
                    render={(record) => {
                        const start = record?.planningHorizon?.start;
                        const end = record?.planningHorizon?.end;
                        return start && end
                            ? `${formatTime(start, optionsTime)} - ${formatTime(end, optionsTime)}`
                            : "N/A";
                    }}
                />

                <StatusChipField source="active" label="Ativo" />
            </Datagrid>
        </List>
    );
};

export default ScheduleListView;
