import Modal from "@/components/modal";
import SearchInput from "@/components/SearchInput";
import { useFetchData } from "@/hooks/useFetchData";
import { useEffect, useMemo, useState } from "react";
import { ReportTable } from "@/components/table/ReportTable";
import { useFilteredData } from "@/hooks/useFilteredData";
import { useExportToExcel } from "@/hooks/useExportToExcel";
import { FormatTanggal } from "@/utils/formatTanggal";
import SkeletonTable from "@/components/SkletonTable";

interface Props {
    show: boolean;
    onClose: () => void;
    startDate: string;
    endDate: string;
    prdcd?: string;
    div?: string;
    dept?: string;
    kat?: string;
    strukSupplier?: string;
}

type Struk = {
    no?: number;
    tanggal: string;
    struk: string;
    station: string;
    kasir: string;
    kd_member: string;
    nama_member: string;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
    metode_pembayaran: string;
    jenis_member: string;
};

export default function StrukModal({
    show,
    onClose,
    startDate,
    endDate,
    prdcd,
    div,
    dept,
    kat,
    strukSupplier,
}: Props) {
    const [searchTerm, setSearchTerm] = useState("");

    const queryParams = useMemo(() => {
        const params: Record<string, string | number | boolean> = {
            startDate,
            endDate,
        };
        if (prdcd !== undefined) { params.prdcd = prdcd; }
        if (div !== undefined) { params.div = div; }
        if (dept !== undefined) { params.dept = dept; }
        if (kat !== undefined) { params.kat = kat; }
        if (strukSupplier !== undefined) { params.strukSupplier = strukSupplier; }
        return params;
    }, [startDate, endDate, prdcd, div, dept, kat, strukSupplier]);

    useEffect(() => {
        if (!show) {
            setSearchTerm("");
        }
    }, [show]);

    const { data, error, loading } = useFetchData<Struk[]>({
        endpoint: "/evaluasi-sales/per-struk",
        queryParams,
        enabled: show,
    });

    const filteredData = useFilteredData(data ?? [], searchTerm, [
        "struk",
        "nama_member",
        "kd_member",
        "metode_pembayaran",
        "jenis_member"
    ]);

    const numberedData = useMemo(() => {
        return (filteredData ?? []).map((item, index) => ({
            ...item,
            no: index + 1,
        }));
    }, [filteredData]);

    const columns = useMemo<
        { field: keyof Struk; label: string; isNumeric?: boolean }[]
    >(() => [
        { field: "no", label: "No" },
        { field: "tanggal", label: "Tanggal" },
        { field: "struk", label: "Struk" },
        { field: "station", label: "Station" },
        { field: "kasir", label: "Kasir" },
        { field: "kd_member", label: "Kode" },
        { field: "nama_member", label: "Nama" },
        { field: "jenis_member", label: "Jenis" },
        { field: "metode_pembayaran", label: "Metode" },
        { field: "total_qty", label: "Qty", isNumeric: true },
        { field: "total_gross", label: "Gross", isNumeric: true },
        { field: "total_netto", label: "Netto", isNumeric: true },
        { field: "total_margin", label: "Margin", isNumeric: true },
    ], []);

    const totalRow = useMemo(() => {
        const init: Struk = {
            no: 0,
            tanggal: "",
            struk: "",
            station: "",
            kasir: "",
            kd_member: "",
            nama_member: "",
            metode_pembayaran: "",
            jenis_member: "",
            total_qty: 0,
            total_gross: 0,
            total_netto: 0,
            total_margin: 0,
        };

        return (filteredData ?? []).reduce((acc, cur) => ({
            ...acc,
            total_qty: Number(acc.total_qty) + Number(cur.total_qty),
            total_gross: Number(acc.total_gross) + Number(cur.total_gross),
            total_netto: Number(acc.total_netto) + Number(cur.total_netto),
            total_margin: Number(acc.total_margin) + Number(cur.total_margin),
        }), init);
    }, [filteredData]);

    // ✅ Gunakan useExportToExcel
    const { handleExport } = useExportToExcel<Struk>({
        title: `Detail Struk`,
        headers: columns.map(col => col.label),
        data: numberedData,
        mapRow: (row) => [
            row.no ?? "",
            row.tanggal,
            row.struk,
            row.station,
            row.kasir,
            row.kd_member,
            row.nama_member,
            row.jenis_member,
            row.metode_pembayaran ?? "-",
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
            {loading ? <SkeletonTable columns={columns.length} rows={5} /> :
                <div className="space-y-4 max-h-[90vh]">
                    <div className="flex justify-between items-center my-2">
                        <div>
                            <h1 className="text-2xl font-bold text-green-600">Detail Struk</h1>
                            <p>{FormatTanggal(startDate)} s/d {FormatTanggal(endDate)}</p>
                        </div>
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
                        placeholder="Cari struk..."
                    />

                    {error && <p className="text-red-500">{error}</p>}

                    {!loading && !error && (
                        <ReportTable
                            columns={columns}
                            data={numberedData}
                            totalRow={totalRow}
                            keyField="struk"
                            textHeader="sm"
                            textBody="sm"
                            textFooter="sm"
                            renderHeaderGroup={
                                <tr>
                                    <th colSpan={9} className="bg-blue-400 text-white text-left px-2 py-1 border">
                                        Info Transaksi
                                    </th>
                                    <th colSpan={4} className="bg-green-400 text-white text-left px-2 py-1 border">
                                        Penjualan
                                    </th>
                                </tr>
                            }
                        />
                    )}
                </div>
            }
        </Modal>
    );
}
