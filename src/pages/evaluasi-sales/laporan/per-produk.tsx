import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingIgr from "@/components/LoadingIgr";
import StrukModal from "@/components/modal/evaluasi-sales/StrukModal";
import RowDropdownMenu from "@/components/RowDropdownMenu";
import { FileText } from "lucide-react";
import { buildReport } from "@/utils/reportBuilder";
import { perProdukColumns, PerProdukRows } from "@/configs/evaluasi-sales/perProdukConfig";

const PerProdukPage = () => {
    const config = buildReport<PerProdukRows>(perProdukColumns)
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
    } = useReportPage<PerProdukRows>({
        basePath: "evaluasi-sales",
        ...config
    });
    // State for modal
    // Use a more specific type for selectedRow
    const [selectedRow, setSelectedRow] = useState<PerProdukRows | null>(null);
    const [showStrukModal, setShowStrukModal] = useState(false);

    const handleOpenStrukModal = (row: PerProdukRows) => {
        setSelectedRow(row);
        setShowStrukModal(true);
    };

    const actionsRows = [
        {
            label: "Struk",
            onClick: handleOpenStrukModal,
            icon: <FileText size={16} />,
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
                                columns={perProdukColumns}
                                data={filteredData}
                                totalRow={totalRow}
                                keyField="plu"
                                isRefreshing={isRefreshing}
                                showRowNumber={true}
                                renderHeaderGroup={
                                    <tr>
                                        <th colSpan={6} className="border border-gray-400 px-2 py-2">
                                            Produk
                                        </th>
                                        <th colSpan={7} className="border border-gray-400 bg-red-400 px-2 py-2">
                                            Sales
                                        </th>
                                    </tr>
                                }
                                renderActions={(row) => (
                                    <RowDropdownMenu
                                        label={
                                            <div>
                                                <span className="text-xs text-gray-500">Div: {row.div} - Dept: {row.dept} - Kat: {row.kategori}</span>
                                                <br />
                                                {row.plu} - {row.nama_produk}
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

                        {/* Modal Struk */}
                        <StrukModal
                            show={showStrukModal}
                            onClose={() => setShowStrukModal(false)}
                            startDate={query.startDate as string}
                            endDate={query.endDate as string}
                            div={selectedRow?.div as string}
                            dept={selectedRow?.div as string + selectedRow?.dept as string}
                            kat={selectedRow?.dept as string + selectedRow?.kategori as string}
                            prdcd={selectedRow?.plu}
                        />
                    </>}
            </section>
        </Layout>
    );
};

export default PerProdukPage;
