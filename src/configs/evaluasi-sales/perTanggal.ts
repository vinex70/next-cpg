import { ColumnConfig } from "@/types/report";

export type PerTanggalRows = {
    tanggal: string;
    jumlah_member: number;
    jumlah_struk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

export const perTanggalColumns: ColumnConfig<PerTanggalRows>[] = [
    { field: "tanggal", label: "Tgl", isSearchable: true, group: "Info Tanggal" },
    { field: "jumlah_member", label: "Jumlah Member", isNumeric: true, group: "Sales" },
    { field: "jumlah_struk", label: "Jumlah Struk", isNumeric: true, group: "Sales" },
    { field: "total_qty", label: "Qty", isNumeric: true, group: "Sales" },
    { field: "total_gross", label: "Gross", isNumeric: true, group: "Sales" },
    { field: "total_netto", label: "Netto", isNumeric: true, group: "Sales" },
    { field: "total_margin", label: "Margin", isNumeric: true, group: "Sales" },
];