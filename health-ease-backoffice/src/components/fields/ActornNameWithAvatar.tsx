// src/components/fields/ActorNameWithAvatar.tsx
import React, { useEffect, useState } from "react";
import { useDataProvider } from "react-admin";
import { Practitioner } from "fhir/r4";
import { isNil } from "lodash";
import { Avatar, Box, Typography } from "@mui/material";

const useFetchActor = (reference: string) => {
    const dataProvider = useDataProvider();
    const [actor, setActor] = useState<Practitioner | null>(null);

    useEffect(() => {
        const fetchActor = async () => {
            const { data } = await dataProvider.getOne("Practitioner", { id: reference.split("/")[1] });
            setActor(data);
        };
        fetchActor();
    }, [reference, dataProvider]);

    return actor;
};

const ActorNameWithAvatar: React.FC<{ reference: string }> = ({ reference }) => {
    const actor = useFetchActor(reference);

    if (!actor) return null;

    const given = actor.name?.[0]?.given?.[0];
    const family = actor.name?.[0]?.family;
    const photo = actor.photo;

    if (!given && !family) return null;

    const avatarUrl = isNil(photo) ? undefined : photo[0].url;

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

const ActorName: React.FC<{ reference: string }> = ({ reference }) => {
    const actor = useFetchActor(reference);

    if (!actor) return null;

    const given = actor.name?.[0]?.given?.[0];
    const family = actor.name?.[0]?.family;
    let practitionerName = "";
    if (!given && !family) return null;

    if (actor?.name) {
        practitionerName = given + " " + family;
    }
    return practitionerName;
};

export { ActorName, ActorNameWithAvatar };
