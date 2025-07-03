import React from "react";
import { ReferenceField, TextField } from "react-admin";
import { useTheme } from "@mui/material/styles";

interface TableProps {
    data: string[];
    reference: string;
    displayField: string;
}

const Table: React.FC<TableProps> = ({ data, reference, displayField }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    return (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
                {data.map((itemId: string, index: number) => (
                    <tr
                        key={itemId}
                        style={{
                            backgroundColor:
                                index % 2 === 0
                                    ? isDarkMode
                                        ? "#424242"
                                        : "#f9f9f9"
                                    : isDarkMode
                                      ? "#303030"
                                      : "#ffffff",
                        }}>
                        <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            <ReferenceField source="id" reference={reference} record={{ id: itemId }} link="show">
                                <TextField source={displayField} />
                            </ReferenceField>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
