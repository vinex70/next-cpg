import Modal from "@/components/modal";
import SearchInput from "@/components/SearchInput";
import { useFetchData } from "@/hooks/useFetchData";
import { useEffect, useMemo, useState } from "react";
import { ReportTable } from "@/components/table/ReportTable";
import { useFilteredData } from "@/hooks/useFilteredData";
import { useExportToExcel } from "@/hooks/useExportToExcel";

interface Props {
    show: boolean;
    onClose: () => void;
    startDate: string;
    endDate: string;
    div: string;
    namaDivisi: string;
}

type DetailDivisi = {
    no?: number;
    div: string;
    dept: string;
    kategori: string;
    plu: string;
    nama_produk: string;
    jumlah_member: number;
    jumlah_struk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

export default function DetailDivisiModal({
    show,
    onClose,
    startDate,
    endDate,
    div,
    namaDivisi
}: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const queryParams = useMemo(() => ({
        startDate,
        endDate,
        div,
    }), [startDate, endDate, div]);

    useEffect(() => {
        if (!show) {
            setSearchTerm("");
        }
    }, [show]);


    const { data, error, loading } = useFetchData<DetailDivisi[]>({
        endpoint: "/evaluasi-sales/per-produk",
        queryParams,
        enabled: show,
    });

    const filteredData = useFilteredData(data ?? [], searchTerm, [
        "div",
        "dept",
        "kategori",
        "plu",
        "nama_produk",
    ]);

    const numberedData = useMemo(() => {
        return (filteredData ?? []).map((item, index) => ({
            ...item,
            no: index + 1,
        }));
    }, [filteredData]);

    const columns = useMemo<
        { field: keyof DetailDivisi; label: string; isNumeric?: boolean }[]
    >(() => [
        { field: "no", label: "No" },
        { field: "div", label: "Div" },
        { field: "dept", label: "Dept" },
        { field: "kategori", label: "Kat" },
        { field: "plu", label: "PLU" },
        { field: "nama_produk", label: "Nama Produk" },
        { field: "jumlah_member", label: "Jumlah Member", isNumeric: true },
        { field: "jumlah_struk", label: "Jumlah Struk", isNumeric: true },
        { field: "total_qty", label: "Total Qty", isNumeric: true },
        { field: "total_gross", label: "Total Gross", isNumeric: true },
        { field: "total_netto", label: "Total Netto", isNumeric: true },
        { field: "total_margin", label: "Total Margin", isNumeric: true },
    ], []);

    const totalRow = useMemo(() => {
        const init: DetailDivisi = {
            no: 0,
            div: "",
            dept: "",
            kategori: "",
            plu: "",
            nama_produk: "",
            jumlah_member: 0,
            jumlah_struk: 0,
            total_qty: 0,
            total_gross: 0,
            total_netto: 0,
            total_margin: 0,
        };

        return (filteredData ?? []).reduce((acc, cur) => ({
            ...acc,
            jumlah_member: Number(acc.jumlah_member) + Number(cur.jumlah_member),
            jumlah_struk: Number(acc.jumlah_struk) + Number(cur.jumlah_struk),
            total_qty: Number(acc.total_qty) + Number(cur.total_qty),
            total_gross: Number(acc.total_gross) + Number(cur.total_gross),
            total_netto: Number(acc.total_netto) + Number(cur.total_netto),
            total_margin: Number(acc.total_margin) + Number(cur.total_margin),
        }), init);
    }, [filteredData]);

    // ✅ Gunakan useExportToExcel
    const { handleExport } = useExportToExcel<DetailDivisi>({
        title: `Detail Divisi: ${div} - ${namaDivisi}`,
        headers: columns.map(col => col.label),
        data: numberedData,
        mapRow: (row) => [
            row.no ?? "",
            row.div,
            row.dept,
            row.kategori,
            row.plu,
            row.nama_produk,
            Number(row.jumlah_member),
            Number(row.jumlah_struk),
            Number(row.total_qty),
            Number(row.total_gross),
            Number(row.total_netto),
            Number(row.total_margin),
        ],
        totalRow: [
            "TOTAL", "", "", "", "", "", "", "", "", // padding kolom string
            Number(totalRow.total_qty),
            Number(totalRow.total_gross),
            Number(totalRow.total_netto),
            Number(totalRow.total_margin),
        ],
    });

    return (
        <Modal show={show} onClose={onClose}>
            <div className="space-y-4 max-h-[90vh]">
                <div className="flex justify-between items-center my-2">
                    <h2 className="text-lg font-bold">
                        Detail Divis: {div} - {namaDivisi}
                    </h2>
                    <button
                        onClick={handleExport}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Export
                    </button>
                </div>

                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Cari detail Produk..."
                />

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <ReportTable
                        columns={columns}
                        data={numberedData}
                        totalRow={totalRow}
                        keyField={(row) => `${row.div}-${row.dept}-${row.kategori}-${row.plu}`}
                        renderHeaderGroup={
                            <tr>
                                <th colSpan={6} className="bg-blue-400 text-white text-left px-2 py-1 border">
                                    Info Produk
                                </th>
                                <th colSpan={6} className="bg-green-400 text-white text-left px-2 py-1 border">
                                    Penjualan
                                </th>
                            </tr>
                        }
                    />
                )}
            </div>
        </Modal>
    );
}
