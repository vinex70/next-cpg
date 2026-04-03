import { ColumnConfig } from "@/types/report";

export type PerKategoriRows = {
    div: string;
    dept: string;
    kategori: string;
    nama_kategori: string;
    jumlah_member: number;
    jumlah_struk: number;
    jumlah_produk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

export const perKategoriColumns: ColumnConfig<PerKategoriRows>[] = [
    { field: "div", label: "Div", isSearchable: true, group: "Info Kategori" },
    { field: "dept", label: "Dept", isSearchable: true, group: "Info Kategori" },
    { field: "kategori", label: "Kat", isSearchable: true, group: "Info Kategori" },
    { field: "nama_kategori", label: "Nama Kategori", isSearchable: true, group: "Info Kategori" },
    { field: "jumlah_member", label: "Jumlah Member", isNumeric: true, group: "Sales" },
    { field: "jumlah_struk", label: "Jumlah Struk", isNumeric: true, group: "Sales" },
    { field: "jumlah_produk", label: "Jumlah Produk", isNumeric: true, group: "Sales" },
    { field: "total_qty", label: "Total Qty", isNumeric: true, group: "Sales" },
    { field: "total_gross", label: "Total Gross", isNumeric: true, group: "Sales" },
    { field: "total_netto", label: "Total Netto", isNumeric: true, group: "Sales" },
    { field: "total_margin", label: "Total Margin", isNumeric: true, group: "Sales" },
];