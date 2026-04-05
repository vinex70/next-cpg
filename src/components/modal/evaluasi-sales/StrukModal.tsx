import Modal from "@/components/modal";
import SearchInput from "@/components/SearchInput";
import { useEffect, useMemo } from "react";
import { ReportTable } from "@/components/table/ReportTable";
import { FormatTanggal } from "@/utils/formatTanggal";
import SkeletonTable from "@/components/SkletonTable";
import { buildReport } from "@/utils/reportBuilder";
import { perStrukColumns, PerStrukRows } from "@/configs/evaluasi-sales/per-struk-config";
import { useReportPage } from "@/hooks/useReportPage";

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

    const config = buildReport<PerStrukRows>(perStrukColumns);

    // ================= QUERY PARAMS =================
    const queryParams = useMemo(() => ({
        startDate,
        endDate,
        ...(prdcd && { plu: prdcd }),
        ...(div && { div }),
        ...(dept && { dept }),
        ...(kat && { kat }),
        ...(strukSupplier && { strukSupplier }),
    }), [startDate, endDate, prdcd, div, dept, kat, strukSupplier]);

    // ================= USE REPORT PAGE =================
    const {
        searchTerm,
        setSearchTerm,
        filteredData,
        loading,
        error,
        totalRow,
        handleExport,
    } = useReportPage<PerStrukRows>({
        basePath: "evaluasi-sales", // tetap wajib (dipakai hook internal)
        ...config,
        customFetch: {
            endpoint: "/evaluasi-sales/per-struk",
            queryParams,
            enabled: show, // 🔥 hanya fetch saat modal buka
        },
    });

    useEffect(() => {
        if (!show) {
            setSearchTerm("");
        }
    }, [show, setSearchTerm]);

    const dataClean = filteredData as PerStrukRows[];

    return (
        <Modal show={show} onClose={onClose}>
            {loading ? <SkeletonTable columns={config.tableColumns.length} rows={5} /> :
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
                            columns={config.tableColumns}
                            data={dataClean}
                            totalRow={totalRow}
                            keyField="struk"
                            textHeader="sm"
                            textBody="sm"
                            textFooter="sm"
                            headerGroups={config.headerGroups}
                        />
                    )}
                </div>
            }
        </Modal>
    );
}
