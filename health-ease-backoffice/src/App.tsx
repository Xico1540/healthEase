import * as React from "react";
import { Admin, Resource } from "react-admin";
import Layout from "./components/Layout";
import PatientListView from "./components/fhir/Patient/PatientListView";
import LoginPage from "./components/login/LoginPage";
import authProvider from "./services/AuthProvider";
import PractitionerListView from "./components/fhir/Practitioner/PractitionerListView";
import FhirDataProvider from "./services/DataProvider";
import PatientCreateView from "./components/fhir/Patient/PatientCreateView";
import PractitionerCreateView from "./components/fhir/Practitioner/PractitionerCreateView";
import OrganizationListView from "./components/fhir/Organization/OrganizationListView";
import OrganizationCreateView from "./components/fhir/Organization/OrganizationCreateView";
import LocationListView from "./components/fhir/Location/LocationListView";
import LocationCreateView from "./components/fhir/Location/LocationCreateView";
import PractitionerRoleCreateView from "./components/fhir/PractitionerRole/PractitionerRoleCreateView";
import PractitionerRoleListView from "./components/fhir/PractitionerRole/PractitionerRoleListView";
import SlotCreateView from "./components/fhir/Slot/SlotCreateView";
import SlotListView from "./components/fhir/Slot/SlotListView";
import ScheduleListView from "./components/fhir/Schedule/ScheduleListView";
import AppointmentListView from "./components/fhir/Appointment/AppointmentListView";
import ScheduleCreateView from "./components/fhir/Schedule/ScheduleCreateView";
import AppointmentCreateView from "./components/fhir/Appointment/AppointmentCreateView";

const App: React.FC = () => {
    const dataProvider = new FhirDataProvider();
    return (
        <Admin loginPage={LoginPage} dataProvider={dataProvider} authProvider={authProvider} layout={Layout}>
            <Resource name="Patient" list={PatientListView} create={PatientCreateView} />
            <Resource name="Practitioner" list={PractitionerListView} create={PractitionerCreateView} />
            <Resource name="PractitionerRole" list={PractitionerRoleListView} create={PractitionerRoleCreateView} />
            <Resource name="Schedule" list={ScheduleListView} create={ScheduleCreateView} />
            <Resource name="Appointment" list={AppointmentListView} create={AppointmentCreateView} />
            <Resource name="Slot" list={SlotListView} create={SlotCreateView} />
            <Resource name="Organization" list={OrganizationListView} create={OrganizationCreateView} />
            <Resource name="Location" list={LocationListView} create={LocationCreateView} />
        </Admin>
    );
};

export default App;
