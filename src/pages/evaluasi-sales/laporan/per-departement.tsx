import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { FormatTanggal } from "@/utils/formatTanggal";

// Tipe data hasil dari API
type DivisiRow = {
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

    return (
        <Layout title={router.query.selectedReport?.toString().replaceAll(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "-"}>
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-green-600">📊 Laporan {router.query.selectedReport?.toString().replaceAll(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "-"}</h1>
                <p>Periode : {FormatTanggal(router.query.startDate?.toLocaleString())} s/d {FormatTanggal(router.query.endDate?.toLocaleString())}</p>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <table className="min-w-full border mt-4 text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-2 border">Div</th>
                                <th className="p-2 border">Dept</th>
                                <th className="p-2 border">Nama Dept</th>
                                <th className="p-2 border">Member</th>
                                <th className="p-2 border">Struk</th>
                                <th className="p-2 border">Produk</th>
                                <th className="p-2 border">Qty</th>
                                <th className="p-2 border">Gross</th>
                                <th className="p-2 border">Netto</th>
                                <th className="p-2 border">Margin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((row) => (
                                    <tr key={row.div + row.dept} className="hover:bg-gray-50">
                                        <td className="p-2 border">{row.div}</td>
                                        <td className="p-2 border">{row.dept}</td>
                                        <td className="p-2 border">{row.nama_dept}</td>
                                        <td className="p-2 border text-right">{row.jumlah_member}</td>
                                        <td className="p-2 border text-right">{row.jumlah_struk}</td>
                                        <td className="p-2 border text-right">{row.jumlah_produk}</td>
                                        <td className="p-2 border text-right">{row.total_qty}</td>
                                        <td className="p-2 border text-right">{row.total_gross.toLocaleString()}</td>
                                        <td className="p-2 border text-right">{row.total_netto.toLocaleString()}</td>
                                        <td className="p-2 border text-right">{row.total_margin.toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="p-4 text-center text-gray-500">
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
};

export default PerDivisiPage;
