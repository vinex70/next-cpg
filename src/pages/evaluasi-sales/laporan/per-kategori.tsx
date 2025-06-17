// pages/evaluasi-sales/laporan/per-.tsx
import { useState } from "react";
// components
import Layout from "@/components/Layout";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
// hooks
import { useFetchData } from "@/hooks/useFetchData";
import { useRefreshRouter } from "@/hooks/useRefreshRouter";
import { useReportQueryEndpoint } from "@/hooks/useReportQueryEndpoint";
import { useReportTableLogic } from "@/hooks/useReportTableLogic";
import { useExportToExcel } from "@/hooks/useExportToExcel";
import { formatNumber } from "@/utils/formatNumber";

// Tipe data hasil dari API
type KategoriRows = {
    div: string;
    dept: string;
    kategori: string;
    nama_kategori: string;
    jumlah_member: number;
    jumlah_struk: number;
    jumlah_produk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

const PerKategoriPage = () => {
    const { query, endpoint } = useReportQueryEndpoint();
    const [searchTerm, setSearchTerm] = useState("");

    const { data, loading, error } = useFetchData<KategoriRows[]>({
        endpoint,
        queryParams: query as Record<string, string>,
        enabled: !!query.selectedReport,
    });

    const { isRefreshing, handleRefresh } = useRefreshRouter(loading);

    const { filteredData, title, periode, totalRow } = useReportTableLogic<KategoriRows>(
        data ?? undefined,
        searchTerm,
        ["div", "dept", "kategori", "nama_kategori"],
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

    const { handleExport } = useExportToExcel<KategoriRows>({
        title,
        headers: [
            "Div",
            "Dept",
            "kat",
            "Nama Kategori",
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
            row.dept,
            row.kategori,
            row.nama_kategori,
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
                                <TableHead colSpan={4} className="text-center"> Kategori </TableHead>
                                <TableHead rowSpan={2} className="text-center border"> Member </TableHead>
                                <TableHead rowSpan={2} className="text-center border"> Struk </TableHead>
                                <TableHead rowSpan={2} className="text-center border"> Produk </TableHead>
                                <TableHead rowSpan={2} className="text-center border"> Qty </TableHead>
                                <TableHead rowSpan={2} className="text-center border"> Gross </TableHead>
                                <TableHead rowSpan={2} className="text-center border"> Netto </TableHead>
                                <TableHead rowSpan={2} className="text-center border"> Margin </TableHead>
                            </TableRow>
                            <TableRow className="border bg-blue-400 dark:bg-blue-600 hover:bg-blue-500">
                                <TableHead className="text-center border">Div</TableHead>
                                <TableHead className="text-center border">Dept</TableHead>
                                <TableHead className="text-center border">Kat</TableHead>
                                <TableHead className="text-center border">Nama</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="border dark:bg-gray-800">
                            {filteredData.length > 0 ? (
                                filteredData.map((row) => (
                                    <TableRow key={row.div.concat(row.dept).concat(row.kategori)} className="border">
                                        <TableCell className="border text-center">{row.div}</TableCell>
                                        <TableCell className="border text-center">{row.dept}</TableCell>
                                        <TableCell className="border text-center">{row.kategori}</TableCell>
                                        <TableCell className="border text-center">{row.nama_kategori}</TableCell>
                                        <TableCell className="text-end border"> {row.jumlah_member} </TableCell>
                                        <TableCell className="text-end border"> {row.jumlah_struk} </TableCell>
                                        <TableCell className="text-end border"> {row.jumlah_produk} </TableCell>
                                        <TableCell className="text-end border"> {formatNumber(row.total_qty)} </TableCell>
                                        <TableCell className="text-end border"> {formatNumber(row.total_gross)} </TableCell>
                                        <TableCell className="text-end border"> {formatNumber(row.total_netto)} </TableCell>
                                        <TableCell className="text-end border"> {formatNumber(row.total_margin)} </TableCell>
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
                                <TableCell colSpan={4} className="text-center font-bold">
                                    Total
                                </TableCell>
                                {totalRow.slice(4).map((val, i) => (
                                    <TableCell key={i} className="text-end border">
                                        {val}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableFooter>
                    </Table>
                )}
            </section>
        </Layout>
    );
};

export default PerKategoriPage;
