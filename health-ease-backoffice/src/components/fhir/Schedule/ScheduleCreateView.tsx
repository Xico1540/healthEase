import * as React from "react";
import {
    Create,
    SimpleForm,
    BooleanInput,
    ReferenceInput,
    SelectInput,
    SaveButton,
    Toolbar,
    ArrayInput,
    SimpleFormIterator,
    TimeInput,
    AutocompleteArrayInput,
    TextInput,
} from "react-admin";
import { Card, CardContent } from "@mui/material";
import { GridWrapper, CustomGrid, CustomBox } from "../../styles/styles";
import ScheduleController from "../../../controllers/ScheduleController";
import {
    getServiceTypesFromEnum,
    ScheduleServiceCategory,
    ScheduleServiceType,
} from "../../../model/fhir/Schedule/ScheduleChoices";
import valueSetRolesMock from "../../../mockData/valueSets/SpecialtiesMock";

const ScheduleCreateViewToolbar: React.FC = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

const ScheduleCreateView: React.FC = () => {
    const serviceTypes = getServiceTypesFromEnum(ScheduleServiceType);

    const specialties = valueSetRolesMock.compose.include[0].concept.map((item: { code: string; display: string }) => ({
        id: item.code,
        name: item.display,
    }));

    const serviceCategories = getServiceTypesFromEnum(ScheduleServiceCategory);
    return (
        <Create transform={ScheduleController.transformCreate}>
            <Card>
                <CardContent>
                    <SimpleForm toolbar={<ScheduleCreateViewToolbar />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    <BooleanInput source="active" label="Ativo" />
                                </CustomGrid>
                                <CustomGrid>
                                    <ReferenceInput
                                        source="actor"
                                        reference="Practitioner"
                                        label="Profissional"
                                        isRequired>
                                        <SelectInput
                                            optionText={(record) =>
                                                `${record?.name?.[0]?.given || ""} ${record?.name?.[0]?.family || ""}`
                                            }
                                        />
                                    </ReferenceInput>
                                </CustomGrid>
                                <CustomGrid>
                                    <AutocompleteArrayInput
                                        source="serviceType"
                                        label="Service Type"
                                        choices={serviceTypes}
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <AutocompleteArrayInput
                                        source="specialty"
                                        label="Especialidade"
                                        choices={specialties}
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <AutocompleteArrayInput
                                        source="serviceCategory"
                                        label="Service Category"
                                        choices={serviceCategories}
                                    />
                                </CustomGrid>

                                <CustomGrid>
                                    <ArrayInput source="planningHorizon">
                                        <SimpleFormIterator>
                                            <TimeInput source="start" label="Hora de Início" />
                                            <TimeInput source="end" label="Hora de Término" />
                                        </SimpleFormIterator>
                                    </ArrayInput>
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="comment" label="Comentário" />
                                </CustomGrid>
                            </GridWrapper>
                        </CustomBox>
                    </SimpleForm>
                </CardContent>
            </Card>
        </Create>
    );
};

export default ScheduleCreateView;
