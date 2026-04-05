
import { ColumnConfig } from "@/types/report";

export type PerBulanRows = {
    bulan: string;
    nama_bulan: string;
    jumlah_member: number;
    jumlah_struk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

export const perBulanColumns: ColumnConfig<PerBulanRows>[] = [
    { field: "bulan", label: "Bulan", isSearchable: true, group: "Info Bulan", groupColor: "bg-green-400" },
    { field: "nama_bulan", label: "Nama Bulan", isSearchable: true, group: "Info Bulan", groupColor: "bg-green-400" },
    { field: "jumlah_member", label: "Jumlah Member", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "jumlah_struk", label: "Jumlah Struk", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_qty", label: "Total Qty", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_gross", label: "Total Gross", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_netto", label: "Total Netto", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_margin", label: "Total Margin", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
];