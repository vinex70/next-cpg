// configs/supplierConfig.ts
import { ColumnConfig } from "@/types/report";

/**
 * =========================================
 * 🔥 REPORT CONFIG: SUPPLIER
 * =========================================
 *
 * 📌 Cara pakai:
 * - Tambah field → edit di SupplierRows
 * - Atur tampilan tabel → edit di supplierColumns
 *
 * 📌 Fitur otomatis:
 * - Header grouping berdasarkan `group`
 * - Warna header dari `groupColor`
 * - Search dari `isSearchable`
 * - Format angka + total dari `isNumeric`
 *
 * -----------------------------------------
 * 📦 ColumnConfig:
 * -----------------------------------------
 * field        → key data (WAJIB sesuai type)
 * label        → nama kolom di UI
 * isNumeric    → auto format number + total
 * isSearchable → ikut search filter
 * group        → grouping header
 * groupColor   → warna header group (Tailwind)
 *
 * -----------------------------------------
 * 📌 Contoh:
 * -----------------------------------------
 * {
 *   field: "nama",
 *   label: "Nama",
 *   isSearchable: true,
 *   group: "Info",
 *   groupColor: "bg-blue-400"
 * }
 */

export type SupplierRows = {
    hgb_kodesupplier: string;
    sup_namasupplier: string;
    ttl_plu: number;

};

export const supplierColumns: ColumnConfig<SupplierRows>[] = [
    {
        field: "hgb_kodesupplier",
        label: "Kode Supplier",
        isSearchable: true,
    },
    {
        field: "sup_namasupplier",
        label: "Nama Supplier",
        isSearchable: true,
    },
    {
        field: "ttl_plu",
        label: "Ttl Produk",
        isNumeric: true,
    },
];
