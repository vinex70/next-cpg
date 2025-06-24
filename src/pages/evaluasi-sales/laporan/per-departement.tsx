// pages/evaluasi-sales/laporan/per-departement.tsx
import { useState } from "react";
// components
import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { useReportPage } from "@/hooks/useReportPage";
import { ReportTable } from "@/components/table/ReportTable";
import { Button } from "@/components/ui/button";
import ProdukTanggalModal from "@/components/modal/evaluasi-sales/ProdukTanggalModal";
import ProdukModal from "@/components/modal/evaluasi-sales/ProdukModal";
import StrukModal from "@/components/modal/evaluasi-sales/StrukModal";
import LoadingIgr from "@/components/LoadingIgr";
import RowDropdownMenu from "@/components/RowDropdownMenu";
import { FileText, PackageSearch, ReceiptText } from "lucide-react";

// Tipe data hasil dari API
type DepartementRows = {
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

const PerDepartementPage = () => {
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
    } = useReportPage<DepartementRows>({
        searchableFields: ["div", "dept", "nama_dept"],
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
            "div",
            "dept",
            "nama_dept",
            "member",
            "struk",
            "produk",
            "qty",
            "gross",
            "netto",
            "margin",
        ],
        mapRow: (row) => [
            row.div,
            row.dept,
            row.nama_dept,
            Number(row.jumlah_member),
            Number(row.jumlah_struk),
            Number(row.jumlah_produk),
            Number(row.total_qty),
            Number(row.total_gross),
            Number(row.total_netto),
            Number(row.total_margin),
        ]
    })

    const columns: { field: keyof DepartementRows; label: string; isNumeric?: boolean }[] = [
        { field: "div", label: "Div" },
        { field: "dept", label: "Dept" },
        { field: "nama_dept", label: "Nama" },
        { field: "jumlah_member", label: "Member", isNumeric: true },
        { field: "jumlah_struk", label: "Struk", isNumeric: true },
        { field: "jumlah_produk", label: "Produk", isNumeric: true },
        { field: "total_qty", label: "Qty", isNumeric: true },
        { field: "total_gross", label: "Gross", isNumeric: true },
        { field: "total_netto", label: "Netto", isNumeric: true },
        { field: "total_margin", label: "Margin", isNumeric: true },
    ]

    const [selectedRow, setSelectedRow] = useState<DepartementRows | null>(null);
    const [showProdukModal, setShowProdukModal] = useState(false);
    const [showProdukTanggalModal, setShowProdukTanggalModal] = useState(false);
    const [showStrukModal, setShowStrukModal] = useState(false);

    const handleOpenProdukTanggalModal = (row: DepartementRows) => {
        setSelectedRow(row);
        setShowProdukTanggalModal(true);
    };

    const handleOpenStrukModal = (row: DepartementRows) => {
        setSelectedRow(row);
        setShowStrukModal(true);
    };

    const handleOpenProdukModal = (row: DepartementRows) => {
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
            <section className="space-y-2 p-2">
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
                                className="text-sm h-8 bg-red-400 dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-black hover:bg-red-500 text-white shadow-2xl hover:cursor-pointer"
                            >
                                Reset
                            </Button>
                            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search Departement..." />
                        </div>

                        {error && <p className="text-red-500">{error}</p>}

                        {!error && filteredData && (
                            <ReportTable
                                columns={columns}
                                data={filteredData}
                                totalRow={totalRow}
                                keyField={(row) => `${row.div}-${row.dept}`}
                                showRowNumber={true}
                                isRefreshing={isRefreshing}
                                renderHeaderGroup={
                                    <tr>
                                        <th colSpan={4} className="border border-gray-400 px-2 py-2">
                                            Depertement
                                        </th>
                                        <th colSpan={8} className="border border-gray-400 px-2 py-2">
                                            Sales
                                        </th>
                                    </tr>
                                }
                                renderActions={(row) => (
                                    <RowDropdownMenu
                                        label={
                                            <div>
                                                <span className="text-xs text-gray-500">Divisi: {row.div}</span>
                                                <br />
                                                {row.dept} - {row.nama_dept}
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

                        {/* Modal Produk Per Tanggal */}
                        <ProdukTanggalModal
                            show={showProdukTanggalModal}
                            onClose={() => setShowProdukTanggalModal(false)}
                            startDate={query.startDate as string}
                            endDate={query.endDate as string}
                            div={selectedRow?.div as string}
                            dept={selectedRow?.div as string + selectedRow?.dept as string}
                        />
                        {/* Modal Produk */}
                        <ProdukModal
                            show={showProdukModal}
                            onClose={() => setShowProdukModal(false)}
                            startDate={query.startDate as string}
                            endDate={query.endDate as string}
                            div={selectedRow?.div as string}
                            dept={selectedRow?.div as string + selectedRow?.dept as string}
                        />

                        {/* Modal Struk */}
                        <StrukModal
                            show={showStrukModal}
                            onClose={() => setShowStrukModal(false)}
                            startDate={query.startDate as string}
                            endDate={query.endDate as string}
                            div={selectedRow?.div as string}
                            dept={selectedRow?.div as string + selectedRow?.dept as string}
                        />
                    </>
                }
            </section>
        </Layout>
    );
};

export default PerDepartementPage;
