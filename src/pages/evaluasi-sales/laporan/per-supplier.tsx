import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProdukModal from "@/components/modal/evaluasi-sales/ProdukModal";
import LoadingIgr from "@/components/LoadingIgr";
import RowDropdownMenu from "@/components/RowDropdownMenu";
import { ReceiptText } from "lucide-react";

type SupplierRow = {
    kode_supplier: string;
    nama_supplier: string;
    jumlah_member: number;
    jumlah_struk: number;
    jumlah_produk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

const PerSupplierPage = () => {
    const {
        query,
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
    } = useReportPage<SupplierRow>({
        searchableFields: ["kode_supplier", "nama_supplier"],
        numericFields: [
            "jumlah_member",
            "jumlah_struk",
            "jumlah_produk",
            "total_qty",
            "total_gross",
            "total_netto",
            "total_margin",
        ],
        headers: [
            "Kode Supplier",
            "Nama Supplier",
            "Member",
            "Struk",
            "Produk",
            "Qty",
            "Gross",
            "Netto",
            "Margin",
        ],
        mapRow: (row) => [
            row.kode_supplier,
            row.nama_supplier,
            Number(row.jumlah_member),
            Number(row.jumlah_struk),
            Number(row.jumlah_produk),
            Number(row.total_qty),
            Number(row.total_gross),
            Number(row.total_netto),
            Number(row.total_margin),
        ],
    });

    const columns: { field: keyof SupplierRow; label: string; isNumeric?: boolean }[] = [
        { field: "kode_supplier", label: "Kode Supplier" },
        { field: "nama_supplier", label: "Nama Supplier" },
        { field: "jumlah_member", label: "Jumlah Member", isNumeric: true },
        { field: "jumlah_struk", label: "Jumlah Struk", isNumeric: true },
        { field: "jumlah_produk", label: "Jumlah Produk", isNumeric: true },
        { field: "total_qty", label: "Qty", isNumeric: true },
        { field: "total_gross", label: "Gross", isNumeric: true },
        { field: "total_netto", label: "Netto", isNumeric: true },
        { field: "total_margin", label: "Margin", isNumeric: true },
    ];

    // State for modal
    // Use a more specific type for selectedRow
    const [selectedRow, setSelectedRow] = useState<SupplierRow | null>(null);
    const [showProdukModal, setShowProdukModal] = useState(false);

    const handleOpenProdukModal = (row: SupplierRow) => {
        setSelectedRow(row);
        setShowProdukModal(true);
    };

    const actionsRows = [
        {
            label: "Produk",
            onClick: handleOpenProdukModal,
            icon: <ReceiptText size={16} />,
        },
    ];

    return (
        <Layout title={title}>
            <section className="space-y-4 p-4">
                {loading && !isRefreshing ? <LoadingIgr /> :
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
                                className="text-sm h-8 bg-red-400 dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-black hover:bg-red-500 text-white shadow-2xl hover:cursor-pointer"
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
                                keyField="kode_supplier"
                                showRowNumber={true}
                                textHeader="sm"
                                textFooter="sm"
                                textBody="xs"
                                isRefreshing={isRefreshing}
                                renderHeaderGroup={
                                    <tr>
                                        <th colSpan={3} className="border border-gray-400 px-2 py-2">
                                            Info Supplier
                                        </th>
                                        <th colSpan={8} className="border border-gray-400 bg-red-400 px-2 py-2">
                                            Sales
                                        </th>
                                    </tr>
                                }
                                renderActions={(row) => (
                                    <RowDropdownMenu
                                        label={
                                            <div>
                                                <span className="text-xs text-gray-500">Supplier: {row.kode_supplier}</span>
                                                <br />
                                                {row.kode_supplier} - {row.nama_supplier}
                                            </div>
                                        }
                                        triggerIconOnly={false}
                                        actions={actionsRows.map(action => ({
                                            label: action.label,
                                            onClick: () => action.onClick(row),
                                            icon: action.icon,
                                        }))} />
                                )}
                            />
                        )}

                        {/* Modal detail */}
                        <ProdukModal
                            show={showProdukModal}
                            onClose={() => setShowProdukModal(false)}
                            startDate={query.startDate as string}
                            endDate={query.endDate as string}
                            kode_supplier={selectedRow?.kode_supplier || ""}
                        />
                    </>}
            </section>
        </Layout>
    );
};

export default PerSupplierPage;
