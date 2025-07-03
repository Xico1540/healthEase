export enum ScheduleActive {
    "true" = "Ativo",
    "false" = "Inativo",
}

export enum ScheduleServiceCategory {
    "_1" = "Adoption",
    "_2" = "Aged Care",
    "_34" = "Allied Health",
    "_3" = "Alternative & Complementary Therapies",
    "_4" = "Child Care and/or Kindergarten",
    "_5" = "Child Development",
    "_6" = "Child Protection & Family Services",
    "_7" = "Community Health Care",
    "_8" = "Counselling",
    "_36" = "Crisis Line (GPAH use only)",
    "_9" = "Death Services",
    "_10" = "Dental",
    "_11" = "Disability Support",
    "_12" = "Drug/Alcohol",
    "_13" = "Education & Learning",
    "_14" = "Emergency Department",
    "_15" = "Employment",
    "_16" = "Financial & Material aid",
    "_17" = "General Practice/GP (doctor)",
    "_35" = "Hospital",
    "_18" = "Housing/Homelessness",
    "_19" = "Interpreting",
    "_20" = "Justice",
    "_21" = "Legal",
    "_22" = "Mental Health",
    "_38" = "NDIA",
    "_23" = "Physical Activity & Recreation",
    "_24" = "Regulation",
    "_25" = "Respite/Carer Support",
    "_26" = "Specialist Clinical Pathology - requires referral",
    "_27" = "Specialist Medical - requires referral",
    "_28" = "Specialist Obstetrics & Gynecology - requires referral",
    "_29" = "Specialist Paediatric - requires referral",
    "_30" = "Specialist Radiology/Imaging - requires referral",
    "_31" = "Specialist Surgical - requires referral",
    "_32" = "Support group/s",
    "_37" = "Test Message (HSD admin use only)",
    "_33" = "Transport",
}

export enum ScheduleServiceType {
    "_57" = "Consulta de rotina",
    "_58" = "Consulta de emergência",
    "_59" = "Consulta de seguimento",
    "_60" = "Exame de sangue",
    "_61" = "Exame de imagem",
    "_62" = "Vacinação de rotina",
    "_63" = "Vacinação de campanha",
    "_64" = "Terapia física",
    "_65" = "Terapia ocupacional",
    "_66" = "Outro tipo de serviço",
}

export const getServiceTypesFromEnum = (enumObj: any) => {
    return Object.entries(enumObj).map(([key, value]) => ({
        id: key.replace("_", ""),
        name: value as string,
    }));
};
