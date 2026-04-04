import { ColumnConfig } from "@/types/report";

export type PerSupplierRows = {
    kode_supplier: string;
    nama_supplier: string;
    jumlah_member: number;
    jumlah_struk: number;
    jumlah_produk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

export const perSupplierColumns: ColumnConfig<PerSupplierRows>[] = [
    { field: "kode_supplier", label: "Kode Supplier", isSearchable: true, group: "Info Supplier" },
    { field: "nama_supplier", label: "Nama Supplier", isSearchable: true, group: "Info Supplier" },
    { field: "jumlah_member", label: "Jumlah Member", isNumeric: true, group: "Sales" },
    { field: "jumlah_struk", label: "Jumlah Struk", isNumeric: true, group: "Sales" },
    { field: "jumlah_produk", label: "Jumlah Produk", isNumeric: true, group: "Sales" },
    { field: "total_qty", label: "Qty", isNumeric: true, group: "Sales" },
    { field: "total_gross", label: "Gross", isNumeric: true, group: "Sales" },
    { field: "total_netto", label: "Netto", isNumeric: true, group: "Sales" },
    { field: "total_margin", label: "Margin", isNumeric: true, group: "Sales" },
]