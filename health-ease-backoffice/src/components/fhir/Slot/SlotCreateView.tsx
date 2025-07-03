import * as React from "react";
import {
    Create,
    SimpleForm,
    DateTimeInput,
    Toolbar,
    SaveButton,
    AutocompleteArrayInput,
    SelectInput,
    ReferenceInput,
} from "react-admin";
import { Card, CardContent } from "@mui/material";
import { GridWrapper, CustomGrid, CustomBox } from "../../styles/styles";
import { getEnumAsChoices } from "../../../utils/reactAdminUtils";
import { ServiceCategoryTypes, SlotStatus } from "../../../model/fhir/Slot/SlotChoices";
import SlotController from "../../../controllers/SlotController";

const SlotCreateViewToolbar: React.FC = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

const SlotCreateView: React.FC = () => {
    return (
        <Create transform={SlotController.transformCreate}>
            <Card>
                <CardContent>
                    <SimpleForm toolbar={<SlotCreateViewToolbar />}>
                        <CustomBox>
                            <GridWrapper container spacing={2}>
                                <CustomGrid>
                                    <AutocompleteArrayInput
                                        source="serviceCategory"
                                        choices={getEnumAsChoices(ServiceCategoryTypes)}
                                        label="Categoria de Serviço"
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <SelectInput
                                        source="status"
                                        label="Status"
                                        choices={getEnumAsChoices(SlotStatus)}
                                    />
                                </CustomGrid>
                                <CustomGrid>
                                    <DateTimeInput source="start" label="Início" />
                                </CustomGrid>
                                <CustomGrid>
                                    <DateTimeInput source="end" label="Fim" />
                                </CustomGrid>
                                <ReferenceInput source="schedule" reference="Schedule" label="Agenda" />
                            </GridWrapper>
                        </CustomBox>
                    </SimpleForm>
                </CardContent>
            </Card>
        </Create>
    );
};

export default SlotCreateView;
