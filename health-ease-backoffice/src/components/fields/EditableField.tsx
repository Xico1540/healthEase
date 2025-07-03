import * as React from "react";
import {
    Labeled,
    TextField,
    TextInput,
    SelectInput,
    DateInput,
    BooleanInput,
    ReferenceInput,
    DateTimeInput,
} from "react-admin";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import { TextInputProps, DateInputProps, BooleanInputProps } from "react-admin";

interface EditableField {
    source: string;
    label: string;
    isEditing: boolean;
    type?: "text" | "select" | "date" | "boolean" | "reference" | "datetime" | "textArea";
    choices?: { id: string; name: string }[];
    multiline?: boolean;
    reference?: string;
    props?: TextInputProps | SelectInputProps | DateInputProps | BooleanInputProps;
}

const EditableField: React.FC<EditableField> = ({
    source,
    label,
    isEditing,
    type = "text",
    choices,
    multiline,
    reference,
    ...props
}) => {
    if (isEditing) {
        switch (type) {
            case "select":
                return <SelectInput source={source} label={label} choices={choices || []} {...props} />;
            case "date":
                return <DateInput source={source} label={label} {...props} />;
            case "boolean":
                return <BooleanInput source={source} label={label} {...props} />;
            case "reference":
                return <ReferenceInput source={source} reference={reference || ""} {...props} />;
            case "datetime":
                return <DateTimeInput source={source} label={label} {...props} />;
            case "textArea":
                return <TextInput source={source} label={label} multiline={true} rows={5} {...props} />;
            default:
                return <TextInput source={source} label={label} multiline={multiline} {...props} />;
        }
    } else {
        return (
            <Labeled>
                <TextField source={source} label={label} />
            </Labeled>
        );
    }
};

export default EditableField;
