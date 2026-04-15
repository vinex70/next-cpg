import { ColumnConfig } from "@/types/report";

export type FormSoHarianRows = {
    prdcd: string;
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
    plano_qty: number;
    omi_recid4: number;
    qty_rom: number;
};

export const formSoHarianColumns: ColumnConfig<FormSoHarianRows>[] = [
    { field: "prdcd", label: "PLU" },
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
    { field: "plano_qty", label: "Plano Qty", isNumeric: true },
    { field: "omi_recid4", label: "Omi Recid4", isNumeric: true },
    { field: "qty_rom", label: "Qty Rom", isNumeric: true },
];
