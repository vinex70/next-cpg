import { ColumnConfig } from "@/types/report";

export type PerProdukRows = {
    div: string;
    dept: string;
    kategori: string;
    plu: string;
    nama_produk: string;
    jumlah_member: number;
    jumlah_struk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

export const perProdukColumns: ColumnConfig<PerProdukRows>[] = [
    { field: "div", label: "Div", isSearchable: true, group: "Info Produk" },
    { field: "dept", label: "Dept", isSearchable: true, group: "Info Produk" },
    { field: "kategori", label: "Kat", isSearchable: true, group: "Info Produk" },
    { field: "plu", label: "PLU", isSearchable: true, group: "Info Produk" },
    { field: "nama_produk", label: "Nama Produk", isSearchable: true, group: "Info Produk" },
    { field: "jumlah_member", label: "Jumlah Member", isNumeric: true, group: "Sales" },
    { field: "jumlah_struk", label: "Jumlah Struk", isNumeric: true, group: "Sales" },
    { field: "total_qty", label: "Total Qty", isNumeric: true, group: "Sales" },
    { field: "total_gross", label: "Total Gross", isNumeric: true, group: "Sales" },
    { field: "total_netto", label: "Total Netto", isNumeric: true, group: "Sales" },
    { field: "total_margin", label: "Total Margin", isNumeric: true, group: "Sales" },
];