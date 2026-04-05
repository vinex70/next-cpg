// import Modal from "@/components/modal";
// import SearchInput from "@/components/SearchInput";
// import { useFetchData } from "@/hooks/useFetchData";
// import { useEffect, useMemo, useState } from "react";
// import { ReportTable } from "@/components/table/ReportTable";
// import { useReportTableLogic } from "@/hooks/useReportTableLogic";
// import { useExportToExcel } from "@/hooks/useExportToExcel";
// import { FormatTanggal } from "@/utils/formatTanggal";
// import SkeletonTable from "@/components/SkletonTable";

import Modal from "@/components/modal";
import SearchInput from "@/components/SearchInput";
import { useEffect, useMemo } from "react";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { FormatTanggal } from "@/utils/formatTanggal";
import SkeletonTable from "@/components/SkletonTable";
import { buildReport } from "@/utils/reportBuilder";
import { perProdukColumns, PerProdukRows } from "@/configs/evaluasi-sales/per-produk-config";

interface Props {
    show: boolean;
    onClose: () => void;
    startDate: string;
    endDate: string;
    div?: string;
    dept?: string;
    kat?: string;
    prdcd?: string;
    struk?: string;
    kode_supplier?: string;
    kasir?: string;
    noMember?: string;
}

export default function ProdukModal({
    show,
    onClose,
    startDate,
    endDate,
    div,
    dept,
    kat,
    prdcd,
    struk,
    kode_supplier,
    kasir,
    noMember,
}: Props) {

    const config = buildReport<PerProdukRows>(perProdukColumns);

    // ================= QUERY PARAMS =================
    const queryParams = useMemo(() => ({
        startDate,
        endDate,
        ...(div && { div }),
        ...(dept && { dept }),
        ...(kat && { kat }),
        ...(prdcd && { plu: prdcd }),
        ...(struk && { struk }),
        ...(kode_supplier && { kode_supplier }),
        ...(kasir && { kasir }),
        ...(noMember && { noMember }),
    }), [startDate, endDate, div, dept, kat, prdcd, struk, kode_supplier, kasir, noMember]);

    // ================= USE REPORT PAGE =================
    const {
        searchTerm,
        setSearchTerm,
        filteredData,
        loading,
        error,
        totalRow,
        handleExport,
    } = useReportPage<PerProdukRows>({
        basePath: "evaluasi-sales", // tetap wajib (dipakai hook internal)
        ...config,
        customFetch: {
            endpoint: "/evaluasi-sales/per-produk",
            queryParams,
            enabled: show, // 🔥 hanya fetch saat modal buka
        },
    });

    useEffect(() => {
        if (!show) {
            setSearchTerm("");
        }
    }, [show, setSearchTerm]);

    const dataClean = filteredData as PerProdukRows[];
    return (
        <Modal show={show} onClose={onClose}>
            {loading ? (
                <SkeletonTable rows={10} columns={config.tableColumns.length} />
            ) : (
                <div className="space-y-4 max-h-[90vh]">

                    {/* HEADER */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-green-600">
                                Detail Produk
                            </h1>
                            <p>
                                {FormatTanggal(startDate)} s/d{" "}
                                {FormatTanggal(endDate)}
                            </p>
                        </div>

                        <button
                            onClick={handleExport}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Export
                        </button>
                    </div>

                    {/* SEARCH */}
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Cari Produk..."
                    />

                    {error && <p className="text-red-500">{error}</p>}

                    {/* TABLE */}
                    {!error && (
                        <ReportTable
                            columns={config.tableColumns}
                            headerGroups={config.headerGroups}
                            renderActions={() => null}
                            data={dataClean}
                            totalRow={totalRow}
                            showRowNumber={true}
                            keyField={(row) =>
                                `${row.div}${row.dept}${row.kategori}${row.plu}`
                            }
                        />
                    )}
                </div>
            )}
        </Modal>
    );
}

// import Modal from "@/components/modal";
// import SearchInput from "@/components/SearchInput";
// import { useFetchData } from "@/hooks/useFetchData";
// import { useEffect, useMemo, useState } from "react";
// import { ReportTable } from "@/components/table/ReportTable";
// import { useFilteredData } from "@/hooks/useFilteredData";
// import { useExportToExcel } from "@/hooks/useExportToExcel";
// import { FormatTanggal } from "@/utils/formatTanggal";
// import SkeletonTable from "@/components/SkletonTable";

// interface Props {
//     show: boolean;
//     onClose: () => void;
//     startDate: string;
//     endDate: string;
//     div?: string;
//     dept?: string;
//     kat?: string;
//     prdcd?: string;
//     struk?: string;
//     kode_supplier?: string;
//     kasir?: string;
//     noMember?: string;
// }

// type ProdukRows = {
//     no?: number;
//     div: string;
//     dept: string;
//     kategori: string;
//     plu: string;
//     nama_produk: string;
//     jumlah_member: number;
//     jumlah_struk: number;
//     total_qty: number;
//     total_gross: number;
//     total_netto: number;
//     total_margin: number;
// };

// export default function ProdukModal({
//     show,
//     onClose,
//     startDate,
//     endDate,
//     div,
//     dept,
//     kat,
//     prdcd,
//     struk,
//     kode_supplier,
//     kasir,
//     noMember,
// }: Props) {
//     const [searchTerm, setSearchTerm] = useState("");

//     // ================= QUERY PARAMS =================
//     const queryParams = useMemo(() => {
//         const params: Record<string, string | number | boolean> = {
//             startDate,
//             endDate,
//         };

//         if (div) params.div = div;
//         if (dept) params.dept = dept;
//         if (kat) params.kat = kat;
//         if (prdcd) params.plu = prdcd;
//         if (struk) params.struk = struk;
//         if (kode_supplier) params.kode_supplier = kode_supplier;
//         if (kasir) params.kasir = kasir;
//         if (noMember) params.noMember = noMember;

//         return params;
//     }, [startDate, endDate, div, dept, kat, prdcd, struk, kode_supplier, kasir, noMember]);

//     useEffect(() => {
//         if (!show) setSearchTerm("");
//     }, [show]);

//     // ================= FETCH =================
//     const { data, error, loading } = useFetchData<ProdukRows[]>({
//         endpoint: "/evaluasi-sales/per-produk",
//         queryParams,
//         enabled: show,
//     });

//     // ================= FILTER =================
//     const filteredData = useFilteredData(data ?? [], searchTerm, [
//         "div",
//         "dept",
//         "kategori",
//         "plu",
//         "nama_produk",
//     ]);

//     // ================= ADD ROW NUMBER =================
//     const numberedData = useMemo(() => {
//         return (filteredData ?? []).map((item, index) => ({
//             ...item,
//             no: index + 1,
//         }));
//     }, [filteredData]);

//     // ================= COLUMNS =================
//     const columns = useMemo<
//         { field: keyof ProdukRows; label: string; isNumeric?: boolean }[]
//     >(() => [
//         { field: "no", label: "No" },
//         { field: "div", label: "Div" },
//         { field: "dept", label: "Dept" },
//         { field: "kategori", label: "Kat" },
//         { field: "plu", label: "PLU" },
//         { field: "nama_produk", label: "Nama Produk" },
//         { field: "jumlah_member", label: "Jumlah Member", isNumeric: true },
//         { field: "jumlah_struk", label: "Jumlah Struk", isNumeric: true },
//         { field: "total_qty", label: "Total Qty", isNumeric: true },
//         { field: "total_gross", label: "Total Gross", isNumeric: true },
//         { field: "total_netto", label: "Total Netto", isNumeric: true },
//         { field: "total_margin", label: "Total Margin", isNumeric: true },
//     ], []);

//     // ================= TOTAL ROW (🔥 AUTO DYNAMIC) =================
//     const totalRow = useMemo(() => {
//         if (!filteredData?.length) return [];

//         return columns.map((col, idx) => {
//             if (idx === 0) return "TOTAL";

//             if (col.isNumeric) {
//                 return filteredData.reduce(
//                     (acc, row) => acc + Number(row[col.field] ?? 0),
//                     0
//                 );
//             }

//             return "";
//         });
//     }, [filteredData, columns]);

//     // ================= EXPORT =================
//     const { handleExport } = useExportToExcel<ProdukRows>({
//         title: "Detail Produk",
//         columns, // 🔥 pakai columns langsung
//         data: numberedData,
//         mapRow: (row) =>
//             columns.map((col) => row[col.field] as string | number | null),
//         totalRow, // 🔥 langsung pakai
//     });

//     return (
//         <Modal show={show} onClose={onClose}>
//             {loading ? (
//                 <SkeletonTable rows={10} columns={columns.length} />
//             ) : (
//                 <div className="space-y-4 max-h-[90vh]">
//                     {/* ================= HEADER ================= */}
//                     <div className="flex justify-between items-center my-2">
//                         <div>
//                             <h1 className="text-2xl font-bold text-green-600">
//                                 Detail Produk
//                             </h1>
//                             <p>
//                                 {FormatTanggal(startDate)} s/d{" "}
//                                 {FormatTanggal(endDate)}
//                             </p>
//                         </div>

//                         <button
//                             onClick={handleExport}
//                             className="text-sm text-blue-600 hover:underline"
//                         >
//                             Export
//                         </button>
//                     </div>

//                     {/* ================= SEARCH ================= */}
//                     <SearchInput
//                         value={searchTerm}
//                         onChange={setSearchTerm}
//                         placeholder="Cari Produk..."
//                     />

//                     {error && <p className="text-red-500">{error}</p>}

//                     {/* ================= TABLE ================= */}
//                     {!loading && !error && (
//                         <ReportTable
//                             columns={columns}
//                             data={numberedData}
//                             totalRow={totalRow}
//                             keyField={(row) =>
//                                 `${row.div}${row.dept}${row.kategori}${row.plu}`
//                             }
//                             renderHeaderGroup={
//                                 <tr>
//                                     <th colSpan={6} className="bg-blue-400 text-white border px-2 py-1">
//                                         Info Produk
//                                     </th>
//                                     <th colSpan={6} className="bg-green-400 text-white border px-2 py-1">
//                                         Penjualan
//                                     </th>
//                                 </tr>
//                             }
//                         />
//                     )}
//                 </div>
//             )}
//         </Modal>
//     );
// }