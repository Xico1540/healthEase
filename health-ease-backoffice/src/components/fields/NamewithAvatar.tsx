import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { useFieldValue } from "ra-core";
import { isNil } from "lodash";

interface NameWithAvatarProps {
    source: string;
    label: string;
}

const NameWithAvatar: React.FC<NameWithAvatarProps> = ({ source }) => {
    const given = useFieldValue({ source: `${source}[0].given` });
    const family = useFieldValue({ source: `${source}[0].family` });
    const photo = useFieldValue({ source: "photo" });

    if (!given && !family) return null;

    const avatarUrl = isNil(photo)
        ? undefined
        : photo[0]?.url ||
        (photo[0]?.data ? `data:${photo[0]?.contentType};base64,${photo[0]?.data}` : undefined);

    return (
        <Box display="flex" alignItems="center">
            <Avatar
                alt={`${given} ${family}`}
                src={avatarUrl}
                sx={{ width: 40, height: 40, marginLeft: "0px !important", margin: "10px" }}
            />
            <Typography variant="body1">
                {given} {family}
            </Typography>
        </Box>
    );
};

export default NameWithAvatar;
