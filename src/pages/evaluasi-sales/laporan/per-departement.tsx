// pages/evaluasi-sales/laporan/per-departement.tsx
import { useState } from "react";
// components
import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { useReportPage } from "@/hooks/useReportPage";
import { ReportTable } from "@/components/table/ReportTable";
import { Button } from "@/components/ui/button";
import DetailDepartementModal from "@/components/modal/evaluasi-sales/DetailDepartementModal";

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

    const numberedData = filteredData?.map((item, index) => ({
        ...item,
        no: String(index + 1),
    })) ?? [];

    const [selectedRow, setSelectedRow] = useState<DepartementRows | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = (row: DepartementRows) => {
        setSelectedRow(row);
        setShowModal(true);
    };

    return (
        <Layout title={title}>
            <section className="space-y-2 p-2">
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

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && filteredData && (
                    <ReportTable
                        columns={columns}
                        data={numberedData}
                        totalRow={totalRow}
                        keyField={(row) => `${row.div}-${row.dept}`}
                        showRowNumber={true}
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
                        renderAction={(row) => (
                            <Button
                                variant={"link"}
                                onClick={() => handleOpenModal(row)}
                                className="text-blue-600 hover:underline hover:cursor-pointer"
                            >
                                Detail
                            </Button>
                        )}
                    />
                )}
                {/* Modal detail */}
                <DetailDepartementModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    startDate={query.startDate as string}
                    endDate={query.endDate as string}
                    div={selectedRow?.div as string}
                    dept={selectedRow?.div as string + selectedRow?.dept as string}
                    namaDepartement={selectedRow?.nama_dept as string}
                />
            </section>
        </Layout>
    );
};

export default PerDepartementPage;
