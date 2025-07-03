import * as React from "react";
import {
    Create,
    SimpleForm,
    TextInput,
    BooleanInput,
    ReferenceInput,
    SelectInput,
    SaveButton,
    Toolbar,
    ArrayInput,
    SimpleFormIterator,
    TimeInput,
    AutocompleteArrayInput,
    ReferenceArrayInput,
} from "react-admin";
import { Card, CardContent } from "@mui/material";
import { GridWrapper, CustomGrid, CustomBox } from "../../styles/styles";
import { getEnumAsChoices, getSpecialitiesAsChoices } from "../../../utils/reactAdminUtils";
import { DaysOfWeek } from "../../../model/fhir/PractitionerRole/PractitionerRoleChoices";
import PractitionerRoleController from "../../../controllers/PractitionerRoleController";

const PractitionerRoleCreateViewToolbar: React.FC = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

const PractitionerRoleCreateView: React.FC = () => {
    const specialtiesValueSetMockChoices = getSpecialitiesAsChoices();

    return (
        <Create transform={PractitionerRoleController.transformCreate}>
            <Card>
                <CardContent>
                    <SimpleForm toolbar={<PractitionerRoleCreateViewToolbar />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    <BooleanInput source="active" label="Ativo" />
                                </CustomGrid>
                                <CustomGrid>
                                    <ReferenceInput source="practitioner" reference="Practitioner" label="Profissional">
                                        <SelectInput
                                            optionText={(record) => `${record.name[0].given} ${record.name[0].family}`}
                                        />
                                    </ReferenceInput>
                                </CustomGrid>
                                <CustomGrid>
                                    <ReferenceInput
                                        source="organization"
                                        reference="Organization"
                                        label="Organização"
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <AutocompleteArrayInput
                                        source="processedSpecialty"
                                        label="Especialidade"
                                        choices={specialtiesValueSetMockChoices}
                                        optionText="display"
                                        optionValue="code"
                                        parse={(value) =>
                                            value.map((code: string) => {
                                                const selectedSpecialty = specialtiesValueSetMockChoices.find(
                                                    (item) => item.code === code,
                                                );
                                                return selectedSpecialty
                                                    ? {
                                                          code: selectedSpecialty.code,
                                                          display: selectedSpecialty.display,
                                                      }
                                                    : { code };
                                            })
                                        }
                                        format={(value) =>
                                            value.map((item: { code: string; display: string } | string) =>
                                                typeof item === "string" ? item : item.code,
                                            )
                                        }
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <ReferenceArrayInput source="location" reference="Location" label="Localização">
                                        <AutocompleteArrayInput />
                                    </ReferenceArrayInput>
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="telecom[0].value" label="Telefone" />
                                </CustomGrid>
                                <CustomGrid>
                                    <TextInput source="telecom[1].value" label="Email" />
                                </CustomGrid>
                                <CustomGrid>
                                    <ArrayInput source="availableTime">
                                        <SimpleFormIterator>
                                            <AutocompleteArrayInput
                                                source="daysofWeek"
                                                label="Dias da Semana"
                                                choices={getEnumAsChoices(DaysOfWeek)}
                                            />
                                            <TimeInput source="availablestarttime" label="Hora de Início" />
                                            <TimeInput source="availableendtime" label="Hora de Término" />
                                        </SimpleFormIterator>
                                    </ArrayInput>
                                </CustomGrid>
                            </GridWrapper>
                        </CustomBox>
                    </SimpleForm>
                </CardContent>
            </Card>
        </Create>
    );
};

export default PractitionerRoleCreateView;
