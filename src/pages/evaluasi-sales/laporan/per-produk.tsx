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

type ProdukRows = {
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

const PerProdukPage = () => {
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
    } = useReportPage<ProdukRows>({
        searchableFields: ["div", "dept", "kategori", "plu", "nama_produk"],
        numericFields: [
            "jumlah_member",
            "jumlah_struk",
            "total_qty",
            "total_gross",
            "total_netto",
            "total_margin",
        ],
        headers: [
            "Div",
            "Dept",
            "Kat",
            "PLU",
            "Nama Produk",
            "Jumlah Member",
            "Jumlah Struk",
            "Total Qty",
            "Total Gross",
            "Total Netto",
            "Total Margin",
        ],
        mapRow: (row) => [
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
    });

    const columns: { field: keyof ProdukRows; label: string; isNumeric?: boolean }[] = [
        { field: "div", label: "Div" },
        { field: "dept", label: "Dept" },
        { field: "kategori", label: "Kat" },
        { field: "plu", label: "PLU" },
        { field: "nama_produk", label: "Nama" },
        { field: "jumlah_member", label: "Member", isNumeric: true },
        { field: "jumlah_struk", label: "Struk", isNumeric: true },
        { field: "total_qty", label: "Qty", isNumeric: true },
        { field: "total_gross", label: "Gross", isNumeric: true },
        { field: "total_netto", label: "Netto", isNumeric: true },
        { field: "total_margin", label: "Margin", isNumeric: true },
    ];

    // State for modal
    // Use a more specific type for selectedRow
    const [selectedRow, setSelectedRow] = useState<ProdukRows | null>(null);
    const [showStrukModal, setShowStrukModal] = useState(false);

    const handleOpenStrukModal = (row: ProdukRows) => {
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
                                columns={columns}
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
