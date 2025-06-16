// pages/evaluasi-sales/laporan/per-departement.tsx
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { FormatTanggal } from "@/utils/formatTanggal";
import { useFetchData } from "@/hooks/useFetchData";
import { useFilteredData } from "@/hooks/useFilteredData";
import ButtonExportExcel from "@/components/ButtonExportExcel";
import ButtonRefresh from "@/components/ButtonRefresh";
import SearchInput from "@/components/SearchInput";
import { useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/utils/formatNumber";
import { exportToStyledExcel } from "@/utils/ExportExcel/exportToExcel";
import getDays from "@/hooks/getDays";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Tipe data hasil dari API
type DepartementRows = {
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

const PerDepartementPage = () => {
    const router = useRouter();
    const query = router.query;
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const endpoint = query.selectedReport ? `/evaluasi-sales/${query.selectedReport}` : "";
    const { data, loading, error } = useFetchData<DepartementRows[]>({ endpoint, queryParams: query as Record<string, string>, enabled: !!query.selectedReport });
    const filteredData = useFilteredData(data ?? undefined, searchTerm);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await router.replace(router.asPath);
    };

    useEffect(() => {
        if (!loading) {
            setIsRefreshing(false);
        }
    }, [loading]);

    const title =
        query.selectedReport
            ?.toString()
            .replaceAll(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()) || "-";

    const totalRow = useMemo(() => {
        if (!filteredData) return [];
        return [
            "TOTAL",
            "",
            "",
            formatNumber(filteredData.reduce((acc, row) => acc + Number(row.jumlah_member), 0)),
            formatNumber(filteredData.reduce((acc, row) => acc + Number(row.jumlah_struk), 0)),
            formatNumber(filteredData.reduce((acc, row) => acc + Number(row.jumlah_produk), 0)),
            formatNumber(filteredData.reduce((acc, row) => acc + Number(row.total_qty), 0)),
            formatNumber(filteredData.reduce((acc, row) => acc + Number(row.total_gross), 0)),
            formatNumber(filteredData.reduce((acc, row) => acc + Number(row.total_netto), 0)),
            formatNumber(filteredData.reduce((acc, row) => acc + Number(row.total_margin), 0)),
        ];
    }, [filteredData]);

    const handleExport = async () => {
        if (!filteredData) return;

        const headers = [
            "Div",
            "Kode Dept",
            "Nama Dept",
            "Jumlah Member",
            "Jumlah Struk",
            "Jumlah Produk",
            "Total Qty",
            "Total Gross",
            "Total Netto",
            "Total Margin",
        ];

        const rows = filteredData.map((row) => [
            row.div,
            row.dept,
            row.nama_dept,
            formatNumber(Number(row.jumlah_member)),
            formatNumber(Number(row.jumlah_struk)),
            formatNumber(Number(row.jumlah_produk)),
            formatNumber(Number(row.total_qty)),
            formatNumber(Number(row.total_gross)),
            formatNumber(Number(row.total_netto)),
            formatNumber(Number(row.total_margin)),
        ]);

        await exportToStyledExcel({
            title: `Laporan ${title}`,
            headers,
            rows,
            totalRow,
            fileName: `Laporan_${title}_${getDays()}.xlsx`,
        });
    };

    return (
        <Layout title={router.query.selectedReport?.toString().replaceAll(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "-"}>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-green-600">
                            📊 Laporan {title}
                        </h1>
                        <p>
                            Periode:{" "}
                            {FormatTanggal(router.query.startDate?.toString())} s/d{" "}
                            {FormatTanggal(router.query.endDate?.toString())}
                        </p>
                    </div>
                    <div className="flex gap-2 itemes-center">
                        <ButtonExportExcel handleExport={handleExport} />
                        <ButtonRefresh disabled={isRefreshing} onClick={handleRefresh} isRefreshing={isRefreshing} />
                    </div>
                </div>
                <div className="flex justify-end">
                    <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search..." />
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && filteredData && (
                    <Table className="border bg-white dark:bg-gray-900 shadow-xl">
                        <TableHeader className="border sticky top-0 dark:bg-gray-700">
                            <TableRow className="border bg-blue-400 dark:bg-blue-600 hover:bg-blue-500">
                                <TableHead colSpan={3} className="text-center"> Departement </TableHead>
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
                                <TableHead className="text-center border">Nama</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="border dark:bg-gray-800">
                            {filteredData.length > 0 ? (
                                filteredData.map((row) => (
                                    <TableRow key={row.div} className="border">
                                        <TableCell className="border text-center">{row.div}</TableCell>
                                        <TableCell className="border text-center">{row.dept}</TableCell>
                                        <TableCell className="border text-center">{row.nama_dept}</TableCell>
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
                                <TableCell colSpan={3} className="text-center font-bold">
                                    Total
                                </TableCell>
                                {totalRow.slice(3).map((val, i) => (
                                    <TableCell key={i} className="text-end border">
                                        {val}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableFooter>
                    </Table>
                )}
            </div>
        </Layout>
    );
};

export default PerDepartementPage;
