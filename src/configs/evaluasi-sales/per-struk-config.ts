// configs/perStrukConfig.ts
import { ColumnConfig } from "@/types/report";

export type PerStrukRows = {
    tanggal: string;
    struk: string;
    station: string;
    kasir: string;
    kd_member: string;
    nama_member: string;
    jumlah_produk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
    metode_pembayaran: string;
    jenis_member: string;
};

export const perStrukColumns: ColumnConfig<PerStrukRows>[] = [
    { field: "tanggal", label: "Tanggal", isSearchable: true, group: "Info Struk", groupColor: "bg-green-400" },
    { field: "struk", label: "Struk", isSearchable: true, group: "Info Struk", groupColor: "bg-green-400" },
    { field: "station", label: "Station", isSearchable: true, group: "Info Struk", groupColor: "bg-green-400" },
    { field: "kasir", label: "Kasir", isSearchable: true, group: "Info Struk", groupColor: "bg-green-400" },
    { field: "kd_member", label: "Kode Member", isSearchable: true, group: "Info Struk", groupColor: "bg-green-400" },
    { field: "nama_member", label: "Nama Member", isSearchable: true, group: "Info Struk", groupColor: "bg-green-400" },

    { field: "jumlah_produk", label: "Jumlah Produk", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_qty", label: "Total Qty", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_gross", label: "Total Gross", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_netto", label: "Total Netto", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_margin", label: "Total Margin", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "metode_pembayaran", label: "Metode Pembayaran", isSearchable: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "jenis_member", label: "Jenis Member", isSearchable: true, group: "Sales", groupColor: "bg-red-400" },
];