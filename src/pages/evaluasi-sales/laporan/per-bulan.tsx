import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import StrukModal from "@/components/modal/evaluasi-sales/StrukModal";
import ProdukModal from "@/components/modal/evaluasi-sales/ProdukModal";
import LoadingIgr from "@/components/LoadingIgr";
import { FileText, ReceiptText } from "lucide-react";
import RowDropdownMenu from "@/components/RowDropdownMenu";

type BulanRows = {
    bulan: string;
    nama_bulan: string;
    jumlah_member: number;
    jumlah_struk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

const PerBulanPage = () => {
    const {
        searchTerm,
        setSearchTerm,
        filteredData,
        loading,
        error,
        title,
        periode,
        totalRow,
        handleExport,
        isRefreshing,
        handleRefresh,
    } = useReportPage<BulanRows>({
        searchableFields: ["bulan", "nama_bulan"],
        numericFields: [
            "jumlah_member",
            "jumlah_struk",
            "total_qty",
            "total_gross",
            "total_netto",
            "total_margin",
        ],
        headers: [
            "bulan",
            "Jumlah Member",
            "Jumlah Struk",
            "Total Qty",
            "Total Gross",
            "Total Netto",
            "Total Margin",
        ],
        mapRow: (row) => [
            row.nama_bulan,
            Number(row.jumlah_member),
            Number(row.jumlah_struk),
            Number(row.total_qty),
            Number(row.total_gross),
            Number(row.total_netto),
            Number(row.total_margin),
        ],
    });

    const columns: { field: keyof BulanRows; label: string; isNumeric?: boolean }[] = [
        { field: "nama_bulan", label: "Bulan" },
        { field: "jumlah_member", label: "Member", isNumeric: true },
        { field: "jumlah_struk", label: "Struk", isNumeric: true },
        { field: "total_qty", label: "Qty", isNumeric: true },
        { field: "total_gross", label: "Gross", isNumeric: true },
        { field: "total_netto", label: "Netto", isNumeric: true },
        { field: "total_margin", label: "Margin", isNumeric: true },
    ];

    const [selectedRow, setSelectedRow] = useState<BulanRows | null>(null);
    const [showProdukModal, setShowProdukModal] = useState(false);
    const [showStrukModal, setShowStrukModal] = useState(false);

    const getMonthRange = (
        monthYear?: string
    ): { startDate: string; endDate: string } => {
        if (!monthYear) {
            return { startDate: "", endDate: "" };
        }

        const [monthStr, yearStr] = monthYear.split("-");
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);

        if (isNaN(month) || isNaN(year)) {
            return { startDate: "", endDate: "" };
        }

        const startDate = new Date(year, month - 1, 1); // awal bulan
        const endDate = new Date(year, month, 0);       // akhir bulan

        const formatLocalDate = (date: Date): string => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
        };

        return {
            startDate: formatLocalDate(startDate),
            endDate: formatLocalDate(endDate),
        };
    };


    const monthRange = getMonthRange(selectedRow?.bulan);


    const handleOpenStrukModal = (row: BulanRows) => {
        setSelectedRow(row);
        setShowStrukModal(true);
    };

    const handleOpenProdukModal = (row: BulanRows) => {
        setSelectedRow(row);
        setShowProdukModal(true);
    };

    const actionsRows = [
        {
            label: "Produk",
            onClick: handleOpenProdukModal,
            icon: <ReceiptText size={16} />,
        },
        {
            label: "Struk",
            onClick: handleOpenStrukModal,
            icon: <FileText size={16} />,
        },
    ];

    return (
        <Layout title={title}>
            <section className="space-y-4 p-4">
                {loading && !isRefreshing ?
                    <LoadingIgr /> :
                    <>
                        <ReportHeader
                            title={title}
                            periode={periode}
                            onExport={handleExport}
                            onRefresh={handleRefresh}
                            isRefreshing={isRefreshing}
                        />

                        <div className="flex space-x-2 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setSearchTerm("")}
                                className="text-sm h-8 bg-red-400 hover:bg-red-500 text-white shadow hover:cursor-pointer"
                            >
                                Reset
                            </Button>
                            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Cari..." />
                        </div>

                        {error && <p className="text-red-500">{error}</p>}

                        {!error && filteredData && (
                            <ReportTable
                                columns={columns}
                                data={filteredData}
                                totalRow={totalRow}
                                keyField="bulan"
                                showRowNumber={true}
                                isRefreshing={isRefreshing}
                                textHeader="sm"
                                textFooter="sm"
                                renderHeaderGroup={
                                    <tr>
                                        <th colSpan={2} className="border border-gray-400 px-2 py-2">
                                            Info
                                        </th>
                                        <th colSpan={7} className="border border-gray-400 px-2 py-2 bg-red-400">
                                            Sales
                                        </th>
                                    </tr>
                                }
                                renderActions={(row) => (
                                    <RowDropdownMenu
                                        label={`Tgl: ${row.bulan}`}
                                        triggerIconOnly={false}
                                        actions={actionsRows.map(action => ({
                                            label: action.label,
                                            onClick: () => action.onClick(row),
                                            icon: action.icon,
                                        }))} />
                                )}
                            />
                        )}

                        {/* Modal Produk */}
                        <ProdukModal
                            show={showProdukModal}
                            onClose={() => setShowProdukModal(false)}
                            startDate={monthRange.startDate}
                            endDate={monthRange.endDate}
                        />

                        {/* Modal Struk */}
                        <StrukModal
                            show={showStrukModal}
                            onClose={() => setShowStrukModal(false)}
                            startDate={monthRange.startDate}
                            endDate={monthRange.endDate}
                        />
                    </>
                }
            </section>
        </Layout>
    );
};

export default PerBulanPage;
