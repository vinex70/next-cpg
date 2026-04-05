// configs/test/test-produkConfig.ts
import { ColumnConfig } from "@/types/report";

/**
 * =========================================
 * 🔥 REPORT CONFIG: TESTPRODUK
 * =========================================
 *
 * 📌 Cara pakai:
 * - Tambah field → edit di TestProdukRows
 * - Atur tampilan tabel → edit di testProdukColumns
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

export type TestProdukRows = {
    // 🔥 isi field di sini
    field1: string;
    field2: number;
};

export const testProdukColumns: ColumnConfig<TestProdukRows>[] = [
    {
        field: "field1",
        label: "Field 1",
        isSearchable: true,
        group: "Info",
        groupColor: "bg-blue-400",
    },
    {
        field: "field2",
        label: "Field 2",
        isNumeric: true,
        group: "Data",
        groupColor: "bg-green-400",
    },
];
