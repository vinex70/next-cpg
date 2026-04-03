import { ColumnConfig } from "@/types/report";

export type PerDivisiRows = {
    div: string;
    nama_div: string;
    jumlah_member: number;
    jumlah_struk: number;
    jumlah_produk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

export const perDivisiColumns: ColumnConfig<PerDivisiRows>[] = [
    { field: "div", label: "Divisi", isSearchable: true, group: "Info Divisi" },
    { field: "nama_div", label: "Nama Divisi", isSearchable: true, group: "Info Divisi" },
    { field: "jumlah_member", label: "Jumlah Member", isNumeric: true, group: "Sales" },
    { field: "jumlah_struk", label: "Jumlah Struk", isNumeric: true, group: "Sales" },
    { field: "jumlah_produk", label: "Jumlah Produk", isNumeric: true, group: "Sales" },
    { field: "total_qty", label: "Total Qty", isNumeric: true, group: "Sales" },
    { field: "total_gross", label: "Total Gross", isNumeric: true, group: "Sales" },
    { field: "total_netto", label: "Total Netto", isNumeric: true, group: "Sales" },
    { field: "total_margin", label: "Total Margin", isNumeric: true, group: "Sales" },
];