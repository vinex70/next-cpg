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
    { field: "div", label: "Div", isSearchable: true, group: "Info Kategori", groupColor: "bg-green-400" },
    { field: "dept", label: "Dept", isSearchable: true, group: "Info Kategori", groupColor: "bg-green-400" },
    { field: "kategori", label: "Kat", isSearchable: true, group: "Info Kategori", groupColor: "bg-green-400" },
    { field: "nama_kategori", label: "Nama Kategori", isSearchable: true, group: "Info Kategori", groupColor: "bg-green-400" },
    { field: "jumlah_member", label: "Jumlah Member", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "jumlah_struk", label: "Jumlah Struk", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "jumlah_produk", label: "Jumlah Produk", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_qty", label: "Total Qty", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_gross", label: "Total Gross", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_netto", label: "Total Netto", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_margin", label: "Total Margin", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
];