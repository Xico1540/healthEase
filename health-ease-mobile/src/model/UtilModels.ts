import React from "react";

export type SubmitFormRef = {
    submitForm: () => Promise<void>;
};

export interface FormComponentProps {
    component: React.ComponentType<any>;
    name: string;
    props?: any;
}
