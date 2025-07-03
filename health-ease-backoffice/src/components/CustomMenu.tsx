import * as React from "react";
import { MenuItemLink } from "react-admin";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PlaceIcon from "@mui/icons-material/Place";
import GroupIcon from "@mui/icons-material/Group";
import BusinessIcon from "@mui/icons-material/Business";

const CustomMenu: React.FC = () => {
    return (
        <>
            <MenuItemLink to="/Patient" primaryText="Utentes" leftIcon={<PersonIcon />} />
            <MenuItemLink to="/Practitioner" primaryText="Profissionais" leftIcon={<GroupIcon />} />
            <MenuItemLink to="/PractitionerRole" primaryText="Papeis" leftIcon={<MedicalServicesIcon />} />
            <MenuItemLink to="/Schedule" primaryText="Agenda" leftIcon={<CalendarTodayIcon />} />
            <MenuItemLink to="/Appointment" primaryText="Marcações" leftIcon={<DateRangeIcon />} />
            <MenuItemLink to="/Slot" primaryText="Slots" leftIcon={<DateRangeIcon />} />
            <MenuItemLink to="/Organization" primaryText="Organização" leftIcon={<BusinessIcon />} />
            <MenuItemLink to="/Location" primaryText="Localização" leftIcon={<PlaceIcon />} />
        </>
    );
};

export default CustomMenu;
