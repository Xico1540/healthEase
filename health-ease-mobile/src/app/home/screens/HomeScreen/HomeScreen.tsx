import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/core";
import { Appointment, Practitioner, PractitionerRole } from "fhir/r4";
import { logger } from "react-native-logs";
import SearchInput from "@/src/components/inputs/searchInput/SearchInput";
import LightTheme from "@/src/theme/LightTheme";
import { useSafeAreaColorContext } from "@/src/context/SafeAreaColorContext";
import ResourceService from "@/src/services/ResourceService";
import AllowedFhirTypes from "@/src/model/AllowedFhirTypes";
import { AuthContextEnum } from "@/src/model/Authentication";
import { useAuth } from "@/src/context/AuthProviderContext";
import HomeScreenHeader from "@/src/components/headers/HomeScreenHeader";
import HomeScreenStyles from "@/src/app/home/screens/HomeScreenStyles";
import PatientHomeScreen from "@/src/app/home/screens/PatientHomeScreen/PatientHomeScreen";
import PractitionerHomeScreen from "@/src/app/home/screens/PractitionerHomeScreen/PractitionerHomeScreen";

type PractitionerWithRole = {
    practitioner: Practitioner | null;
    practitionerRole: PractitionerRole;
};

const HomeScreen: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [practitionersData, setPractitionersData] = useState<PractitionerWithRole[]>([]);
    const [appointmentData, setAppointmentData] = useState<Appointment | null>(null);
    const [selectedSpeciality, setSelectedSpeciality] = useState<string | null>(null);
    const styles = HomeScreenStyles();
    const { setBackgroundColor } = useSafeAreaColorContext();
    const { userDetails, isPatient } = useAuth();
    const ResourceServiceInstance = ResourceService.getInstance(AuthContextEnum.CLIENT);
    const log = logger.createLogger();

    const fetchPractitionersByHumanName = async (name?: string, selectedSpecialityProps?: string) => {
        try {
            const practitionerResponse = await ResourceServiceInstance.getList(AllowedFhirTypes.Practitioner, {
                ...(name && { name }),
                ...(selectedSpecialityProps && { specialty: selectedSpecialityProps })
            });

            const practitioners = practitionerResponse.entry || [];
            const practitionersWithRoles = await Promise.all(
                practitioners.map(async (entry) => {
                    const practitioner = entry.resource as Practitioner;
                    try {
                        const practitionerRolesResponse = await ResourceServiceInstance.getList(
                            AllowedFhirTypes.PractitionerRole,
                            { practitioner: `Practitioner/${practitioner.id}` }
                        );
                        const practitionerRole = practitionerRolesResponse.entry?.[0]?.resource as PractitionerRole;
                        if (practitionerRole) {
                            return { practitioner, practitionerRole };
                        }
                    } catch (error) {
                        throw new Error(
                            `Error fetching practitioner role data, error: ${error instanceof Error ? error.message : error}`
                        );
                    }
                    return null;
                })
            );

            setPractitionersData(practitionersWithRoles.filter(Boolean) as PractitionerWithRole[]);
        } catch (error) {
            if (error instanceof Error) {
                log.error(`Error fetching practitioners data, error: ${error.message}`);
            } else {
                log.error(`Error fetching practitioners data, error: ${error}`);
            }
        }
    };

    const fetchAppointmentData = async () => {
        try {
            const appointmentResponse = await ResourceServiceInstance.getList(AllowedFhirTypes.Appointment, {
                participant: `Patient/${userDetails?.id!}`
            });
            const data = appointmentResponse.entry?.[0]?.resource as Appointment;
            setAppointmentData(data);
        } catch (error) {
            throw new Error("Error fetching appointment data");
        }
    };

    const refreshData = async () => {
        try {
            await Promise.all([fetchAppointmentData(), fetchPractitionersByHumanName(searchText, selectedSpeciality!)]);
        } catch (error) {
            log.error(`Error refreshing data: ${error instanceof Error ? error.message : error}`);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    await Promise.all([fetchAppointmentData(), fetchPractitionersByHumanName("")]);
                } catch (error) {
                    log.error(`Error fetching data: ${error instanceof Error ? error.message : error}`);
                }
            };
            fetchData()
                .then(() => {
                    log.info("Data fetched successfully");
                })
                .catch((error) => {
                    log.error("Error fetching data", error);
                });
        }, [userDetails])
    );

    const handleSearchChange = (text: string) => {
        setSearchText(text);
        (async () => {
            await fetchPractitionersByHumanName(text, selectedSpeciality!);
        })();
    };

    const handleClearSearch = () => {
        (async () => {
            await fetchPractitionersByHumanName(undefined, selectedSpeciality!);
        })();
        setSearchText("");
        setSelectedSpeciality(null);
    };

    useEffect(() => {
        (async () => {
            await fetchPractitionersByHumanName(undefined, selectedSpeciality!);
        })();
    }, [selectedSpeciality]);

    useFocusEffect(
        useCallback(() => {
            setBackgroundColor(LightTheme.colors.primary);
        }, [])
    );

    return (
        <View style={styles.container}>
            <View
                style={{
                    backgroundColor: LightTheme.colors.primary,
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    borderBottomLeftRadius: 35,
                    borderBottomRightRadius: 35
                }}>
                <HomeScreenHeader />
                {isPatient ? (
                    <SearchInput
                        searchText={searchText}
                        onSearchChange={handleSearchChange}
                        onClearSearch={handleClearSearch}
                    />
                ) : undefined}
            </View>
            {isPatient ? (
                <PatientHomeScreen
                    practitionersData={practitionersData}
                    appointmentData={appointmentData}
                    setSelectedSpeciality={setSelectedSpeciality}
                    refreshData={refreshData}
                />
            ) : (
                <PractitionerHomeScreen userDetails={userDetails} />
            )}
        </View>
    );
};

export default HomeScreen;
