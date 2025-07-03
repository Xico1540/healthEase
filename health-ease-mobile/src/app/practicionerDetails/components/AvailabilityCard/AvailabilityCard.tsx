import React, { useEffect, useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BundleEntry, Practitioner, Schedule, Slot } from "fhir/r4";
import { format, isWithinInterval, parseISO } from "date-fns";
import AvailabilityCardStyles from "@/src/app/practicionerDetails/components/AvailabilityCard/AvailabilityCardStyles";
import AllowedFhirTypes from "@/src/model/AllowedFhirTypes";
import ResourceService from "@/src/services/ResourceService";
import { AuthContextEnum } from "@/src/model/Authentication";
import CustomButton from "@/src/components/buttons/CustomButton/CustomButton";
import CustomIcons, { IconType } from "@/src/components/icons/CustomIcons";
import LightTheme from "@/src/theme/LightTheme";
import { formatDateTime, getWeekInterval } from "@/src/utils/dateUtils";

const styles = AvailabilityCardStyles;

interface AvailabilityCardProps {
    practitioner: Practitioner;
    setSelectedSlot: React.Dispatch<React.SetStateAction<Slot | null>>;
}

const mapSlotsToJSX = (
    slots: Slot[],
    isSelected: (slotId: string) => boolean,
    handleSlotSelect: (slotId: string) => void,
) =>
    slots.map((slot) => {
        const { day, time } = formatDateTime(slot.start, slot.end);
        const selected = isSelected(slot.id!);
        const isOccupied = slot.status === "busy";

        return (
            <View
                key={slot.id}
                style={[styles.scheduleItem, selected && styles.selectedSlot, isOccupied && styles.mutedSlot]}
                onTouchEnd={() => !isOccupied && handleSlotSelect(slot.id!)}>
                <View style={styles.rowContainer}>
                    <View style={styles.columnContainer}>
                        <Text style={[styles.day, selected && styles.selectedText, isOccupied && styles.mutedText]}>
                            {day}
                        </Text>
                        <Text style={[styles.time, selected && styles.selectedText, isOccupied && styles.mutedText]}>
                            {time}
                        </Text>
                    </View>
                    {selected && !isOccupied && (
                        <CustomIcons
                            icon={{
                                value: {
                                    type: IconType.featherIcon,
                                    name: "check",
                                },
                                size: 19,
                                color: LightTheme.colors.white,
                            }}
                        />
                    )}
                </View>
            </View>
        );
    });

const AvailabilityCard: React.FC<AvailabilityCardProps> = ({ practitioner, setSelectedSlot }) => {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>("Todos");
    const [selectedPeriod, setSelectedPeriod] = useState<string>("Todos");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const ResourceServiceInstance = ResourceService.getInstance(AuthContextEnum.CLIENT);

    const { weekStart, weekEnd } = getWeekInterval(selectedDate);

    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    const handleSlotSelect = (slotId: string) => {
        setSelectedSlotId(slotId);
        setSelectedSlot(slots.find((slot) => slot.id === slotId) || null);
    };

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const scheduleResponse = await ResourceServiceInstance.getList(AllowedFhirTypes.Schedule, {
                    actor: practitioner.id!,
                });

                const entries: BundleEntry<Schedule>[] = (scheduleResponse.entry as BundleEntry<Schedule>[]) || [];
                const slotPromises = entries.map(async (entry: BundleEntry<Schedule>) => {
                    if (entry.resource && entry.resource.id) {
                        return ResourceServiceInstance.getList(AllowedFhirTypes.Slot, {
                            schedule: entry.resource.id,
                        });
                    }
                });

                const slotResponses = await Promise.all(slotPromises);
                const slotEntries = slotResponses.flatMap((response) => (response!.entry as BundleEntry<Slot>[]) || []);
                const slotResources = slotEntries.map((entry) => entry.resource as Slot);
                setSlots(slotResources);
            } catch (error) {
                console.error("Error fetching schedule or slot data", error);
            }
        };

        fetchSchedule().catch((error) => {
            console.error("Error fetching schedule", error);
        });
    }, []);

    const handleDayChange = (day: string) => {
        setSelectedDay(day);
    };

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period);
    };

    const filterByPeriod = (slot: Slot) => {
        const startHour = parseISO(slot.start).getHours();
        if (selectedPeriod === "Morning") {
            return startHour >= 6 && startHour < 12;
        }
        if (selectedPeriod === "Afternoon") {
            return startHour >= 12 && startHour < 18;
        }
        return true;
    };

    const handleDateChange = (_event: any, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            setSelectedDate(date);
        }
    };

    const filteredSlots = slots
        .filter(
            (slot) =>
                isWithinInterval(parseISO(slot.start), { start: weekStart, end: weekEnd }) &&
                (selectedDay === "Todos" || format(parseISO(slot.start), "EEEE") === selectedDay),
        )
        .filter(filterByPeriod)
        .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());

    const isMorningSlot = (slot: Slot) => {
        const startHour = parseISO(slot.start).getHours();
        return startHour >= 6 && startHour < 12;
    };

    const morningSlots = filteredSlots.filter(isMorningSlot);
    const afternoonSlots = filteredSlots.filter((slot) => !isMorningSlot(slot));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Disponibilidades para marcação</Text>
            <View style={styles.pickerContainer}>
                <View style={styles.datePickerContainer}>
                    <CustomButton
                        variant="secondary"
                        title={`Semana de ${format(weekStart, "dd/MM/yyyy")} até ${format(weekEnd, "dd/MM/yyyy")}`}
                        onPress={() => setShowDatePicker(true)}
                    />
                </View>
                <CustomButton
                    variant="secondary"
                    title="Filtrar Disponibilidade"
                    icon={{ type: IconType.featherIcon, name: "filter" }}
                    onPress={() => setShowFilters(!showFilters)}
                />
                {showFilters && (
                    <>
                        <View style={styles.pickerWithBorder}>
                            <Picker selectedValue={selectedDay} onValueChange={handleDayChange}>
                                <Picker.Item label="Todos os Dias" value="Todos" />
                                <Picker.Item label="Segunda-feira" value="Monday" />
                                <Picker.Item label="Terça-feira" value="Tuesday" />
                                <Picker.Item label="Quarta-feira" value="Wednesday" />
                                <Picker.Item label="Quinta-feira" value="Thursday" />
                                <Picker.Item label="Sexta-feira" value="Friday" />
                                <Picker.Item label="Sábado" value="Saturday" />
                                <Picker.Item label="Domingo" value="Sunday" />
                            </Picker>
                        </View>
                        <View style={styles.pickerWithBorder}>
                            <Picker selectedValue={selectedPeriod} onValueChange={handlePeriodChange}>
                                <Picker.Item label="De Manhã" value="Morning" />
                                <Picker.Item label="De Tarde" value="Afternoon" />
                                <Picker.Item label="A Qualquer Horário" value="Todos" />
                            </Picker>
                        </View>
                    </>
                )}
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    onChange={handleDateChange}
                />
            )}

            <ScrollView contentContainerStyle={styles.scheduleList}>
                {filteredSlots.length > 0 ? (
                    <>
                        {selectedPeriod === "Todos" && (
                            <>
                                <View>
                                    <Text style={styles.label}>De Manhã</Text>
                                    <View style={styles.slotContainer}>
                                        {morningSlots.length > 0 ? (
                                            mapSlotsToJSX(
                                                morningSlots,
                                                (slotId) => selectedSlotId === slotId,
                                                handleSlotSelect,
                                            )
                                        ) : (
                                            <Text style={styles.label}>Sem disponibilidade de manhã.</Text>
                                        )}
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.label}>De Tarde</Text>
                                    <View style={styles.slotContainer}>
                                        {afternoonSlots.length > 0 ? (
                                            mapSlotsToJSX(
                                                afternoonSlots,
                                                (slotId) => selectedSlotId === slotId,
                                                handleSlotSelect,
                                            )
                                        ) : (
                                            <Text style={styles.label}>Sem disponibilidade de tarde.</Text>
                                        )}
                                    </View>
                                </View>
                            </>
                        )}
                        {selectedPeriod !== "Todos" &&
                            mapSlotsToJSX(filteredSlots, (slotId) => selectedSlotId === slotId, handleSlotSelect)}
                    </>
                ) : (
                    <Text>O profissional não presta cuidados nessa semana.</Text>
                )}
            </ScrollView>
        </View>
    );
};

export default AvailabilityCard;
