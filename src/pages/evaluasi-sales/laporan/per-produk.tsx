import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { useState } from "react";
import DetailProdukModal from "@/components/modal/DetailProdukModal";

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
            row.jumlah_member,
            row.jumlah_struk,
            row.total_qty,
            row.total_gross,
            row.total_netto,
            row.total_margin,
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

    const [selectedRow, setSelectedRow] = useState<ProdukRows | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = (row: ProdukRows) => {
        setSelectedRow(row);
        setShowModal(true);
    };

    return (
        <Layout title={title}>
            <section className="space-y-4 p-4">
                <ReportHeader
                    title={title}
                    periode={periode}
                    onExport={handleExport}
                    onRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
                />

                <div className="flex justify-end">
                    <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Cari..." />
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && filteredData && (
                    <ReportTable
                        columns={columns}
                        data={filteredData}
                        totalRow={totalRow}
                        keyField="plu"
                        renderHeaderGroup={
                            <tr>
                                <th colSpan={5} className="border border-gray-400 px-2 py-2">
                                    Produk
                                </th>
                                <th colSpan={7} className="border border-gray-400 px-2 py-2">
                                    Sales
                                </th>
                            </tr>
                        }
                        renderAction={(row) => (
                            <button
                                onClick={() => handleOpenModal(row)}
                                className="text-blue-600 hover:underline"
                            >
                                Detail
                            </button>
                        )}
                    />
                )}

                {/* Modal detail */}
                <DetailProdukModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    startDate={query.startDate as string}
                    endDate={query.endDate as string}
                    prdcd={selectedRow?.plu as string}
                    namaProduk={selectedRow?.nama_produk as string}
                />
            </section>
        </Layout>
    );
};

export default PerProdukPage;
