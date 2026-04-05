import { ColumnConfig } from "@/types/report";

export type PerKasirRows = {
    kasir: string;
    nama_kasir: string;
    station: string;
    jumlah_struk: string;
    jumlah_member: number;
    jumlah_produk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

export const perKasirColumns: ColumnConfig<PerKasirRows>[] = [
    { field: "kasir", label: "Kasir", isSearchable: true, group: "Info Kasir", groupColor: "bg-green-400" },
    { field: "nama_kasir", label: "Nama Kasir", isSearchable: true, group: "Info Kasir", groupColor: "bg-green-400" },
    { field: "station", label: "Station", isSearchable: true, group: "Info Kasir", groupColor: "bg-green-400" },
    { field: "jumlah_struk", label: "Jumlah Struk", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "jumlah_member", label: "Jumlah Member", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "jumlah_produk", label: "Jumlah Produk", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_qty", label: "Total Qty", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_gross", label: "Total Gross", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_netto", label: "Total Netto", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_margin", label: "Total Margin", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
];