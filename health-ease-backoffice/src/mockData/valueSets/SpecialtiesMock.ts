const specialtiesValueSetMock = {
    resourceType: "ValueSet",
    id: "c80-practice-codes",
    meta: {
        extension: [
            {
                url: "http://hapifhir.io/fhir/StructureDefinition/valueset-expansion-message",
                valueString:
                    "ValueSet was expanded using an expansion that was pre-calculated at 2024-04-05T19:29:23.925+00:00 (211 days ago)",
            },
        ],
    },
    url: "http://hl7.org/fhir/ValueSet/c80-practice-codes",
    status: "active",
    compose: {
        include: [
            {
                system: "http://snomed.info/sct",
                concept: [
                    {
                        code: "408467006",
                        display: "Doença mental adulta",
                    },
                    {
                        code: "394577000",
                        display: "Anestesiologia",
                    },
                    {
                        code: "394578005",
                        display: "Medicina audiológica",
                    },
                    {
                        code: "421661004",
                        display: "Banco de sangue e medicina de transfusão",
                    },
                    {
                        code: "408462000",
                        display: "Cuidados com queimaduras",
                    },
                    {
                        code: "394579002",
                        display: "Cardiologia",
                    },
                    {
                        code: "394804000",
                        display: "Citogenética clínica e genética molecular",
                    },
                    {
                        code: "394580004",
                        display: "Genética clínica",
                    },
                    {
                        code: "394803006",
                        display: "Hematologia clínica",
                    },
                    {
                        code: "408480009",
                        display: "Imunologia clínica",
                    },
                    {
                        code: "408454008",
                        display: "Microbiologia clínica",
                    },
                    {
                        code: "394809005",
                        display: "Neurofisiologia clínica",
                    },
                    {
                        code: "394592004",
                        display: "Oncologia clínica",
                    },
                    {
                        code: "394600006",
                        display: "Farmacologia clínica",
                    },
                    {
                        code: "394601005",
                        display: "Fisiologia clínica",
                    },
                    {
                        code: "394581000",
                        display: "Medicina comunitária",
                    },
                    {
                        code: "408478003",
                        display: "Medicina de cuidados intensivos",
                    },
                    {
                        code: "394812008",
                        display: "Especialidades de medicina dentária",
                    },
                    {
                        code: "408444009",
                        display: "Prática dentária geral",
                    },
                    {
                        code: "394582007",
                        display: "Dermatologia",
                    },
                    {
                        code: "408475000",
                        display: "Medicina diabética",
                    },
                    {
                        code: "410005002",
                        display: "Medicina de mergulho",
                    },
                    {
                        code: "394583002",
                        display: "Endocrinologia",
                    },
                    {
                        code: "419772000",
                        display: "Medicina familiar",
                    },
                    {
                        code: "394584008",
                        display: "Gastroenterologia",
                    },
                    {
                        code: "408443003",
                        display: "Prática médica geral",
                    },
                    {
                        code: "394802001",
                        display: "Medicina geral",
                    },
                    {
                        code: "394915009",
                        display: "Patologia geral",
                    },
                    {
                        code: "394814009",
                        display: "Prática geral",
                    },
                    {
                        code: "394808002",
                        display: "Medicina genito-urinária",
                    },
                    {
                        code: "394811001",
                        display: "Medicina geriátrica",
                    },
                    {
                        code: "408446006",
                        display: "Oncologia ginecológica",
                    },
                    {
                        code: "394586005",
                        display: "Ginecologia",
                    },
                    {
                        code: "394916005",
                        display: "Hematopatologia",
                    },
                    {
                        code: "408472002",
                        display: "Hepatologia",
                    },
                    {
                        code: "394597005",
                        display: "Histopatologia",
                    },
                    {
                        code: "394598000",
                        display: "Imunopatologia",
                    },
                    {
                        code: "394807007",
                        display: "Doenças infecciosas",
                    },
                    {
                        code: "419192003",
                        display: "Medicina interna",
                    },
                    {
                        code: "408468001",
                        display: "Deficiência de aprendizagem",
                    },
                    {
                        code: "394593009",
                        display: "Oncologia médica",
                    },
                    {
                        code: "394813003",
                        display: "Oftalmologia médica",
                    },
                    {
                        code: "410001006",
                        display: "Medicina militar",
                    },
                    {
                        code: "394589003",
                        display: "Nefrologia",
                    },
                    {
                        code: "394591006",
                        display: "Neurologia",
                    },
                    {
                        code: "394599008",
                        display: "Neuropatologia",
                    },
                    {
                        code: "394649004",
                        display: "Medicina nuclear",
                    },
                    {
                        code: "408470005",
                        display: "Obstetrícia",
                    },
                    {
                        code: "394585009",
                        display: "Obstetrícia e ginecologia",
                    },
                    {
                        code: "394821009",
                        display: "Medicina ocupacional",
                    },
                    {
                        code: "422191005",
                        display: "Cirurgia oftálmica",
                    },
                    {
                        code: "394594003",
                        display: "Oftalmologia",
                    },
                    {
                        code: "416304004",
                        display: "Medicina manipulativa osteopática",
                    },
                    {
                        code: "418960008",
                        display: "Otorrinolaringologia",
                    },
                    {
                        code: "394882004",
                        display: "Gestão da dor",
                    },
                    {
                        code: "394806003",
                        display: "Medicina paliativa",
                    },
                    {
                        code: "394588006",
                        display: "Psiquiatria pediátrica (criança e adolescente)",
                    },
                    {
                        code: "408459003",
                        display: "Cardiologia pediátrica",
                    },
                    {
                        code: "394607009",
                        display: "Dentisteria pediátrica",
                    },
                    {
                        code: "419610006",
                        display: "Endocrinologia pediátrica",
                    },
                    {
                        code: "418058008",
                        display: "Gastroenterologia pediátrica",
                    },
                    {
                        code: "420208008",
                        display: "Genética pediátrica",
                    },
                    {
                        code: "418652005",
                        display: "Hematologia pediátrica",
                    },
                    {
                        code: "418535003",
                        display: "Imunologia pediátrica",
                    },
                    {
                        code: "418862001",
                        display: "Doenças infecciosas pediátricas",
                    },
                    {
                        code: "419365004",
                        display: "Nefrologia pediátrica",
                    },
                    {
                        code: "418002000",
                        display: "Oncologia pediátrica",
                    },
                    {
                        code: "419983000",
                        display: "Oftalmologia pediátrica",
                    },
                    {
                        code: "419170002",
                        display: "Pneumologia pediátrica",
                    },
                    {
                        code: "419472004",
                        display: "Reumatologia pediátrica",
                    },
                    {
                        code: "394539006",
                        display: "Cirurgia pediátrica",
                    },
                    {
                        code: "420112009",
                        display: "Transplante de medula óssea pediátrica",
                    },
                    {
                        code: "409968004",
                        display: "Medicina preventiva",
                    },
                    {
                        code: "394587001",
                        display: "Psiquiatria",
                    },
                    {
                        code: "394913002",
                        display: "Psicoterapia",
                    },
                    {
                        code: "408440000",
                        display: "Medicina de saúde pública",
                    },
                    {
                        code: "418112009",
                        display: "Medicina pulmonar",
                    },
                    {
                        code: "419815003",
                        display: "Oncologia de radiação",
                    },
                    {
                        code: "394914008",
                        display: "Radiologia",
                    },
                    {
                        code: "408455009",
                        display: "Radiologia intervencionista",
                    },
                    {
                        code: "394602003",
                        display: "Reabilitação",
                    },
                    {
                        code: "408447002",
                        display: "Cuidados de alívio",
                    },
                    {
                        code: "394810000",
                        display: "Reumatologia",
                    },
                    {
                        code: "408450004",
                        display: "Estudos do sono",
                    },
                    {
                        code: "408476004",
                        display: "Transplante de osso e medula",
                    },
                    {
                        code: "408469009",
                        display: "Cirurgia mamária",
                    },
                    {
                        code: "408466002",
                        display: "Cirurgia cardíaca",
                    },
                    {
                        code: "408471009",
                        display: "Transplante cardiotorácico",
                    },
                    {
                        code: "408464004",
                        display: "Cirurgia colorretal",
                    },
                    {
                        code: "408441001",
                        display: "Endodontia dentária",
                    },
                    {
                        code: "408465003",
                        display: "Cirurgia oral e maxilofacial dentária",
                    },
                    {
                        code: "394605001",
                        display: "Cirurgia oral dentária",
                    },
                    {
                        code: "394608004",
                        display: "Ortodontia dentária",
                    },
                    {
                        code: "408461007",
                        display: "Cirurgia periodontal dentária",
                    },
                    {
                        code: "408460008",
                        display: "Dentisteria protética (Prótese dentária)",
                    },
                    {
                        code: "408460008",
                        display: "Prótese dentária cirúrgica",
                    },
                    {
                        code: "394606000",
                        display: "Dentisteria restauradora",
                    },
                    {
                        code: "408449004",
                        display: "Dentisteria cirúrgica",
                    },
                    {
                        code: "394608004",
                        display: "Ortodontia cirúrgica",
                    },
                    {
                        code: "418018006",
                        display: "Cirurgia dermatológica",
                    },
                    {
                        code: "394604002",
                        display: "Cirurgia de ouvido, nariz e garganta",
                    },
                    {
                        code: "394609007",
                        display: "Cirurgia geral",
                    },
                    {
                        code: "408474001",
                        display: "Cirurgia hepatobiliar e pancreática",
                    },
                    {
                        code: "394610002",
                        display: "Neurocirurgia",
                    },
                    {
                        code: "394611003",
                        display: "Cirurgia plástica",
                    },
                    {
                        code: "408477008",
                        display: "Cirurgia de transplante",
                    },
                    {
                        code: "394801008",
                        display: "Traumatologia e ortopedia",
                    },
                    {
                        code: "408463005",
                        display: "Cirurgia vascular",
                    },
                    {
                        code: "419321007",
                        display: "Oncologia cirúrgica",
                    },
                    {
                        code: "394576009",
                        display: "Acidente e emergência cirúrgica",
                    },
                    {
                        code: "394590007",
                        display: "Medicina torácica",
                    },
                    {
                        code: "409967009",
                        display: "Toxicologia",
                    },
                    {
                        code: "408448007",
                        display: "Medicina tropical",
                    },
                    {
                        code: "419043006",
                        display: "Oncologia urológica",
                    },
                    {
                        code: "394612005",
                        display: "Urologia",
                    },
                    {
                        code: "394733009",
                        display: "Especialidade médica--OUTRA--NÃO LISTADA",
                    },
                    {
                        code: "394732004",
                        display: "Especialidade cirúrgica--OUTRA--NÃO LISTADA",
                    },
                ],
            },
        ],
    },
    expansion: {
        identifier: "f1e060c6-b93c-4854-8e63-1abd47d91b7d",
        timestamp: "2024-11-02T17:11:40+00:00",
        total: 0,
        offset: 0,
        parameter: [
            {
                name: "offset",
                valueInteger: 0,
            },
            {
                name: "count",
                valueInteger: 1000,
            },
        ],
    },
};

export default specialtiesValueSetMock;
