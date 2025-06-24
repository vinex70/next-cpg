import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProdukTanggalModal from "@/components/modal/evaluasi-sales/ProdukTanggalModal";
import StrukModal from "@/components/modal/evaluasi-sales/StrukModal";
import ProdukModal from "@/components/modal/evaluasi-sales/ProdukModal";
import LoadingIgr from "@/components/LoadingIgr";
import { FileText, PackageSearch, ReceiptText } from "lucide-react";
import RowDropdownMenu from "@/components/RowDropdownMenu";

type TanggalRows = {
    tanggal: string;
    jumlah_member: number;
    jumlah_struk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

const PerTanggalPage = () => {
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
    } = useReportPage<TanggalRows>({
        searchableFields: ["tanggal"],
        numericFields: [
            "jumlah_member",
            "jumlah_struk",
            "total_qty",
            "total_gross",
            "total_netto",
            "total_margin",
        ],
        headers: [
            "Tgl",
            "Jumlah Member",
            "Jumlah Struk",
            "Total Qty",
            "Total Gross",
            "Total Netto",
            "Total Margin",
        ],
        mapRow: (row) => [
            row.tanggal,
            Number(row.jumlah_member),
            Number(row.jumlah_struk),
            Number(row.total_qty),
            Number(row.total_gross),
            Number(row.total_netto),
            Number(row.total_margin),
        ],
    });

    const columns: { field: keyof TanggalRows; label: string; isNumeric?: boolean }[] = [
        { field: "tanggal", label: "Tgl" },
        { field: "jumlah_member", label: "Member", isNumeric: true },
        { field: "jumlah_struk", label: "Struk", isNumeric: true },
        { field: "total_qty", label: "Qty", isNumeric: true },
        { field: "total_gross", label: "Gross", isNumeric: true },
        { field: "total_netto", label: "Netto", isNumeric: true },
        { field: "total_margin", label: "Margin", isNumeric: true },
    ];

    const convertToISODate = (dateStr: string): string => {
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`;
    };

    const [selectedRow, setSelectedRow] = useState<TanggalRows | null>(null);
    const [showProdukModal, setShowProdukModal] = useState(false);
    const [showProdukTanggalModal, setShowProdukTanggalModal] = useState(false);
    const [showStrukModal, setShowStrukModal] = useState(false);

    const handleOpenProdukTanggalModal = (row: TanggalRows) => {
        setSelectedRow(row);
        setShowProdukTanggalModal(true);
    };

    const handleOpenStrukModal = (row: TanggalRows) => {
        setSelectedRow(row);
        setShowStrukModal(true);
    };

    const handleOpenProdukModal = (row: TanggalRows) => {
        setSelectedRow(row);
        setShowProdukModal(true);
    };

    const actionsRows = [
        {
            label: "Produk Per Tanggal",
            onClick: handleOpenProdukTanggalModal,
            icon: <PackageSearch size={16} />,
        },
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
                                keyField="tanggal"
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
                                        label={`Tgl: ${row.tanggal}`}
                                        triggerIconOnly={false}
                                        actions={actionsRows.map(action => ({
                                            label: action.label,
                                            onClick: () => action.onClick(row),
                                            icon: action.icon,
                                        }))} />
                                )}
                            />
                        )}

                        {/* Modal Produk Per Tanggal */}
                        <ProdukTanggalModal
                            show={showProdukTanggalModal}
                            onClose={() => setShowProdukTanggalModal(false)}
                            startDate={selectedRow?.tanggal ? convertToISODate(selectedRow.tanggal) : ""}
                            endDate={selectedRow?.tanggal ? convertToISODate(selectedRow.tanggal) : ""}
                        />

                        <ProdukModal
                            show={showProdukModal}
                            onClose={() => setShowProdukModal(false)}
                            startDate={selectedRow?.tanggal ? convertToISODate(selectedRow.tanggal) : ""}
                            endDate={selectedRow?.tanggal ? convertToISODate(selectedRow.tanggal) : ""}
                        />

                        {/* Modal Struk */}
                        <StrukModal
                            show={showStrukModal}
                            onClose={() => setShowStrukModal(false)}
                            startDate={selectedRow?.tanggal ? convertToISODate(selectedRow.tanggal) : ""}
                            endDate={selectedRow?.tanggal ? convertToISODate(selectedRow.tanggal) : ""}
                        />
                    </>
                }
            </section>
        </Layout>
    );
};

export default PerTanggalPage;
