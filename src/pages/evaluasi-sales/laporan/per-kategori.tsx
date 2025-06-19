// pages/evaluasi-sales/laporan/per-kategori.tsx
import Layout from "@/components/Layout";
import DetailKategoriModal from "@/components/modal/evaluasi-sales/DetailKategoriModal";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { useState } from "react";

// Tipe data hasil dari API
type KategoriRows = {
    div: string;
    dept: string;
    kategori: string;
    nama_kategori: string;
    jumlah_member: number;
    jumlah_struk: number;
    jumlah_produk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

const PerKategoriPage = () => {
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
    } = useReportPage<KategoriRows>({
        searchableFields: ["div", "dept", "kategori", "nama_kategori"],
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
            "Div",
            "Dept",
            "Kategori",
            "Nama Kategori",
            "Member",
            "Struk",
            "Produk",
            "Qty",
            "Gross",
            "Netto",
            "Margin",
        ],
        mapRow: (row) => [
            row.div,
            row.dept,
            row.kategori,
            row.nama_kategori,
            Number(row.jumlah_member),
            Number(row.jumlah_struk),
            Number(row.jumlah_produk),
            Number(row.total_qty),
            Number(row.total_gross),
            Number(row.total_netto),
            Number(row.total_margin),
        ]
    })

    const columns: { field: keyof KategoriRows; label: string; isNumeric?: boolean }[] = [
        { field: "div", label: "Div" },
        { field: "dept", label: "Dept" },
        { field: "kategori", label: "Katb" },
        { field: "nama_kategori", label: "Nama" },
        { field: "jumlah_member", label: "Member", isNumeric: true },
        { field: "jumlah_struk", label: "Struk", isNumeric: true },
        { field: "jumlah_produk", label: "Produk", isNumeric: true },
        { field: "total_qty", label: "Qty", isNumeric: true },
        { field: "total_gross", label: "Gross", isNumeric: true },
        { field: "total_netto", label: "Netto", isNumeric: true },
        { field: "total_margin", label: "Margin", isNumeric: true },
    ]

    const [selectedRow, setSelectedRow] = useState<KategoriRows | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = (row: KategoriRows) => {
        setSelectedRow(row);
        setShowModal(true);
    };

    const keyField = {
        field: "div_dept_kat",
        label: "Div - Dept - Kat",
        render: (row: KategoriRows) => `${row.div}${row.dept}${row.kategori}`,
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
                    <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search..." />
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && filteredData && (
                    <ReportTable
                        columns={columns}
                        data={filteredData}
                        totalRow={totalRow}
                        keyField={keyField.field as keyof KategoriRows}
                        renderHeaderGroup={
                            <tr>
                                <th colSpan={4} className="border border-gray-400 px-2 py-2">
                                    Kategori
                                </th>
                                <th colSpan={8} className="border border-gray-400 px-2 py-2">
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
                <DetailKategoriModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    startDate={query.startDate as string}
                    endDate={query.endDate as string}
                    div={selectedRow?.div as string}
                    dept={selectedRow?.div as string + selectedRow?.dept as string}
                    kat={selectedRow?.dept as string + selectedRow?.kategori as string}
                    namaKategori={selectedRow?.nama_kategori as string}
                />
            </section>
        </Layout>
    );
};

export default PerKategoriPage;
