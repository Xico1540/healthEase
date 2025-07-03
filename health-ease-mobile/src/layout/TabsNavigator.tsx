import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import HomeScreen from "@/src/app/home/screens/HomeScreen/HomeScreen";
import Appointments from "@/src/app/appointment/screens/Appointments";
import CustomIcons, { IconType } from "@/src/components/icons/CustomIcons";
import UserProfileScreen from "@/src/app/userProfile/screens/UserProfileScreen";

type TabBarIconProps = {
    focused: boolean;
    color: string;
    size: number;
};

const Tab = createBottomTabNavigator();

const TabsNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }: { route: RouteProp<Record<string, object | undefined>, string> }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
                let iconName: string | undefined;
                if (route.name === "Home") {
                    iconName = focused ? "home" : "home";
                } else if (route.name === "Perfil") {
                    iconName = focused ? "user" : "user";
                } else if (route.name === "Marcações") {
                    iconName = focused ? "calendar" : "calendar";
                }
                return (
                    <CustomIcons
                        icon={{
                            value: { type: IconType.featherIcon, name: iconName as any },
                            size,
                            color,
                        }}
                    />
                );
            },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Marcações" component={Appointments} />
        <Tab.Screen name="Perfil" component={UserProfileScreen} />
    </Tab.Navigator>
);

export default TabsNavigator;
