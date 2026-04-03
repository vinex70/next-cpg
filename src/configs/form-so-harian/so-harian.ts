import { ColumnConfig } from "@/types/report";

export type FormSoHarianRows = {
    plu: string;
    desk: string;
    satuan: string;
    tag: string;
    area: string;
    alamat: string;
    modif_by: string;
    plano: number;
    lpp: number;
    acost: number;
    flag: string;
};

export const formSoHarianColumns: ColumnConfig<FormSoHarianRows>[] = [
    { field: "plu", label: "PLU" },
    { field: "desk", label: "Deskripsi" },
    { field: "satuan", label: "Satuan" },
    { field: "tag", label: "Tag" },
    { field: "area", label: "Area" },
    { field: "alamat", label: "Alamat" },
    { field: "modif_by", label: "Modif By" },
    { field: "plano", label: "Plano", isNumeric: true },
    { field: "lpp", label: "LPP", isNumeric: true },
    { field: "acost", label: "ACost", isNumeric: true },
    { field: "flag", label: "Flag" },
];
