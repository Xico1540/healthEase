import React from "react";
import { Chip } from "@mui/material";
import { useFieldValue } from "ra-core";
import { lightColorPalette } from "../../themes/LightTheme";

interface StatusChipProps {
    source: string;
    label: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ source }) => {
    let color;
    let label;
    const fieldValue = useFieldValue({ source });

    switch (fieldValue) {
        case true:
        case "active":
            color = lightColorPalette.success.main;
            label = "Ativo";
            break;
        case false:
        case "inactive":
            color = lightColorPalette.error.main;
            label = "Inativo";
            break;
        case "suspended":
            color = lightColorPalette.warning.main;
            label = "Suspenso";
            break;
        default:
            color = lightColorPalette.secondary.main;
            label = "desconhecido";
    }

    return <Chip label={label} style={{ backgroundColor: color, color: lightColorPalette.common.white }} />;
};

export default StatusChip;
