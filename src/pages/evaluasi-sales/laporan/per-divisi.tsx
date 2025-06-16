// pages/evaluasi-sales/laporan/per-divisi.tsx
import { useState } from "react";
import Layout from "@/components/Layout";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";

import { useFetchData } from "@/hooks/useFetchData";
import { useRefreshRouter } from "@/hooks/useRefreshRouter";
import { useReportQueryEndpoint } from "@/hooks/useReportQueryEndpoint";
import { useReportTableLogic } from "@/hooks/useReportTableLogic";
import { useExportToExcel } from "@/hooks/useExportToExcel";
import { formatNumber } from "@/utils/formatNumber";

type DivisiRow = {
    div: string;
    nama_div: string;
    jumlah_member: number;
    jumlah_struk: number;
    jumlah_produk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

const PerDivisiPage = () => {
    const { query, endpoint } = useReportQueryEndpoint();
    const [searchTerm, setSearchTerm] = useState("");

    const { data, loading, error } = useFetchData<DivisiRow[]>({
        endpoint,
        queryParams: query as Record<string, string>,
        enabled: !!query.selectedReport,
    });

    const { isRefreshing, handleRefresh } = useRefreshRouter(loading);

    const { filteredData, title, periode, totalRow } = useReportTableLogic<DivisiRow>(
        data ?? undefined,
        searchTerm,
        ["div", "nama_div"],
        [
            "jumlah_member",
            "jumlah_struk",
            "jumlah_produk",
            "total_qty",
            "total_gross",
            "total_netto",
            "total_margin",
        ]
    );

    const { handleExport } = useExportToExcel<DivisiRow>({
        title,
        headers: [
            "Kode Divisi",
            "Nama Divisi",
            "Jumlah Member",
            "Jumlah Struk",
            "Jumlah Produk",
            "Total Qty",
            "Total Gross",
            "Total Netto",
            "Total Margin",
        ],
        data: filteredData ?? [],
        mapRow: (row) => [
            row.div,
            row.nama_div,
            formatNumber(row.jumlah_member),
            formatNumber(row.jumlah_struk),
            formatNumber(row.jumlah_produk),
            formatNumber(row.total_qty),
            formatNumber(row.total_gross),
            formatNumber(row.total_netto),
            formatNumber(row.total_margin),
        ],
        totalRow,
    });

    return (
        <Layout title={title}>
            <section className="space-y-4 p-4">
                <ReportHeader
                    title={title}
                    periode={periode}
                    onExport={handleExport}
                    onRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
                />

                <div className="flex justify-end">
                    <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search..." />
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && filteredData && (
                    <Table className="border bg-white dark:bg-gray-900 shadow-xl">
                        <TableHeader className="border sticky top-0 dark:bg-gray-700">
                            <TableRow className="border bg-blue-400 dark:bg-blue-600 hover:bg-blue-500">
                                <TableHead colSpan={2} className="font-bold text-center">Divisi</TableHead>
                                <TableHead rowSpan={2} className="font-bold text-center border">Member</TableHead>
                                <TableHead rowSpan={2} className="font-bold text-center border">Struk</TableHead>
                                <TableHead rowSpan={2} className="font-bold text-center border">Produk</TableHead>
                                <TableHead rowSpan={2} className="font-bold text-center border">Qty</TableHead>
                                <TableHead rowSpan={2} className="font-bold text-center border">Gross</TableHead>
                                <TableHead rowSpan={2} className="font-bold text-center border">Netto</TableHead>
                                <TableHead rowSpan={2} className="font-bold text-center border">Margin</TableHead>
                            </TableRow>
                            <TableRow className="border bg-blue-400 dark:bg-blue-600 hover:bg-blue-500">
                                <TableHead className="font-bold text-center border">Kd</TableHead>
                                <TableHead className="font-bold text-center border">Nama</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="border dark:bg-gray-800">
                            {filteredData.length > 0 ? (
                                filteredData.map((row) => (
                                    <TableRow key={row.div} className="border">
                                        <TableCell className="border text-center">{row.div}</TableCell>
                                        <TableCell className="border text-center">{row.nama_div}</TableCell>
                                        <TableCell className="text-end border">{row.jumlah_member}</TableCell>
                                        <TableCell className="text-end border">{row.jumlah_struk}</TableCell>
                                        <TableCell className="text-end border">{row.jumlah_produk}</TableCell>
                                        <TableCell className="text-end border">{formatNumber(row.total_qty)}</TableCell>
                                        <TableCell className="text-end border">{formatNumber(row.total_gross)}</TableCell>
                                        <TableCell className="text-end border">{formatNumber(row.total_netto)}</TableCell>
                                        <TableCell className="text-end border">{formatNumber(row.total_margin)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="p-4 text-center text-gray-500">
                                        Tidak ada data untuk periode ini
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter className="border">
                            <TableRow className="border">
                                <TableCell colSpan={2} className="text-center font-bold">Total</TableCell>
                                {totalRow.slice(2).map((val, i) => (
                                    <TableCell key={i} className="text-end border">{val}</TableCell>
                                ))}
                            </TableRow>
                        </TableFooter>
                    </Table>
                )}
            </section>
        </Layout>
    );
};

export default PerDivisiPage;
