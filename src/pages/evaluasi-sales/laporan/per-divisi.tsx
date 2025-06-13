import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { FormatTanggal } from "@/utils/formatTanggal";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/utils/formatNumber";
import { Button } from "@/components/ui/button";
import { exportToStyledExcel } from "@/utils/ExportExcel/exportToExcel";

// Tipe data hasil dari API
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
    const router = useRouter();
    const query = router.query;

    const [data, setData] = useState<DivisiRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (Object.keys(query).length > 0) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`/api/evaluasi-sales/${router.query.selectedReport}`, {
                        params: query,
                    });
                    setData(res.data.data);
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        console.error(err);
                    } else {
                        console.error("Unknown error", err);
                    }
                    setError("Gagal memuat data laporan");
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [query, router.query.selectedReport]);

    const handleExport = async () => {
        const headers = [
            "Kode Divisi",
            "Nama Divisi",
            "Jumlah Member",
            "Jumlah Struk",
            "Jumlah Produk",
            "Total Qty",
            "Total Gross",
            "Total Netto",
            "Total Margin",
        ];

        const rows = data.map((row) => [
            row.div,
            row.nama_div,
            formatNumber(Number(row.jumlah_member)),
            formatNumber(Number(row.jumlah_struk)),
            formatNumber(Number(row.jumlah_produk)),
            formatNumber(Number(row.total_qty)),
            formatNumber(Number(row.total_gross)),
            formatNumber(Number(row.total_netto)),
            formatNumber(Number(row.total_margin)),
        ]);

        const totalRow = [
            "TOTAL",
            "",
            formatNumber(data.reduce((acc, row) => acc + Number(row.jumlah_member), 0)),
            formatNumber(data.reduce((acc, row) => acc + Number(row.jumlah_struk), 0)),
            formatNumber(data.reduce((acc, row) => acc + Number(row.jumlah_produk), 0)),
            formatNumber(data.reduce((acc, row) => acc + Number(row.total_qty), 0)),
            formatNumber(data.reduce((acc, row) => acc + Number(row.total_gross), 0)),
            formatNumber(data.reduce((acc, row) => acc + Number(row.total_netto), 0)),
            formatNumber(data.reduce((acc, row) => acc + Number(row.total_margin), 0)),
        ];

        const today = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");

        await exportToStyledExcel({
            title: "LAPORAN PER DIVISI",
            headers,
            rows,
            totalRow,
            fileName: `Laporan_Per_Divisi_${pad(today.getDate())}${pad(today.getMonth() + 1)}${today.getFullYear()}.xlsx`,
        });
    };


    return (
        <Layout title={router.query.selectedReport?.toString().replaceAll(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "-"}>
            <div className="space-y-4 p-4">
                <h1 className="text-2xl font-bold text-green-600">📊 Laporan {router.query.selectedReport?.toString().replaceAll(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "-"}</h1>
                <p>Periode : {FormatTanggal(router.query.startDate?.toLocaleString())} s/d {FormatTanggal(router.query.endDate?.toLocaleString())}</p>
                <Button variant="outline" className="mb-4" size="sm">
                    <span className="flex items-center gap-2" onClick={handleExport}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 3a1 1 0 00-1 1v6H6a1 1 0 000 2h3v6a1 1 0 001.707.707l4-4a1 1 0 000-1.414l-4-4A1 1 0 0010 9V4a1 1 0 00-1-1z" />
                        </svg>
                        Export to Excel
                    </span>
                </Button>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <Table className="border bg-white dark:bg-gray-900 shadow-xl">
                        <TableHeader className="border sticky top-0 dark:bg-gray-700">
                            <TableRow className="border">
                                <TableHead colSpan={2} className="text-center">Divisi</TableHead>
                                <TableHead rowSpan={2} className="text-center border">Member</TableHead>
                                <TableHead rowSpan={2} className="text-center border">Struk</TableHead>
                                <TableHead rowSpan={2} className="text-center border">Produk</TableHead>
                                <TableHead rowSpan={2} className="text-center border">Qty</TableHead>
                                <TableHead rowSpan={2} className="text-center border">Gross</TableHead>
                                <TableHead rowSpan={2} className="text-center border">Netto</TableHead>
                                <TableHead rowSpan={2} className="text-center border">Margin</TableHead>
                            </TableRow>
                            <TableRow className="border">
                                <TableHead className="text-center border">Kd</TableHead>
                                <TableHead className="text-center border">Nama</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="border dark:bg-gray-800">
                            {data.length > 0 ? (
                                data.map((row) => (
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
                                <TableCell className="text-end border">{data.reduce((acc, row) => acc + Number(row.jumlah_member), 0)}</TableCell>
                                <TableCell className="text-end border">{data.reduce((acc, row) => acc + Number(row.jumlah_struk), 0)}</TableCell>
                                <TableCell className="text-end border">{data.reduce((acc, row) => acc + Number(row.jumlah_produk), 0)}</TableCell>
                                <TableCell className="text-end border">{formatNumber(data.reduce((acc, row) => acc + Number(row.total_qty), 0))}</TableCell>
                                <TableCell className="text-end border">{formatNumber(data.reduce((acc, row) => acc + Number(row.total_gross), 0))}</TableCell>
                                <TableCell className="text-end border">{formatNumber(data.reduce((acc, row) => acc + Number(row.total_netto), 0))}</TableCell>
                                <TableCell className="text-end border">{formatNumber(data.reduce((acc, row) => acc + Number(row.total_margin), 0))}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                )}
            </div>
        </Layout>
    );
};

export default PerDivisiPage;
