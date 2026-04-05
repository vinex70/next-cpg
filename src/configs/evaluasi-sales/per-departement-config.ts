import { ColumnConfig } from "@/types/report";

export type PerDepartementRows = {
    div: string;
    dept: string;
    nama_dept: string;
    jumlah_member: number;
    jumlah_struk: number;
    jumlah_produk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

/**
 * 
    * 🔥 CONFIGURATION REPORT PER DEPARTEMENT
    * - Cukup edit di sini untuk ubah seluruh report per departement
    * - Tambah field baru, cukup tambahkan di DepartementRows dan perDepartementColumns
    * - Otomatis header, grouping, dan fitur lainnya akan menyesuaikan dari sini
    * @param DepartementRows tipe data untuk setiap baris (harus sesuai dengan field di database)
    * @param perDepartementColumns konfigurasi kolom untuk report per departement
    * - field: nama field di data (harus sesuai dengan DepartementRows)
    * - label: nama kolom yang tampil di tabel
    * - isNumeric: apakah field ini angka (akan diratakan kanan dan bisa dijumlahkan di total)
    * - isSearchable: apakah field ini bisa dicari dengan search box
    * - group: nama grup untuk header grouping (kolom dengan group yang sama akan digabung di header)
    * Contoh:
    * { field: "kd_member", label: "Kode Member", isSearchable: true, group: "Info Member" }
    * - group: "Info Member" akan membuat kolom "Kode Member" dan "Nama Member" menjadi satu header
 */

export const perDepartementColumns: ColumnConfig<PerDepartementRows>[] = [
    { field: "div", label: "Divisi", isSearchable: true, group: "Info Departement", groupColor: "bg-green-400" },
    { field: "dept", label: "Departement", isSearchable: true, group: "Info Departement", groupColor: "bg-green-400" },
    { field: "nama_dept", label: "Nama Departement", isSearchable: true, group: "Info Departement", groupColor: "bg-green-400" },
    { field: "jumlah_member", label: "Jumlah Member", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "jumlah_struk", label: "Jumlah Struk", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "jumlah_produk", label: "Jumlah Produk", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_qty", label: "Total Qty", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_gross", label: "Total Gross", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_netto", label: "Total Netto", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
    { field: "total_margin", label: "Total Margin", isNumeric: true, group: "Sales", groupColor: "bg-red-400" },
];  