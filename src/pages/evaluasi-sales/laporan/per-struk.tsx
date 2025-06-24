import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProdukModal from "@/components/modal/evaluasi-sales/ProdukModal";
import LoadingIgr from "@/components/LoadingIgr";

type StrukRows = {
    tanggal: string;
    struk: string;
    station: string;
    kasir: string;
    kd_member: string;
    nama_member: string;
    jumlah_produk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
    metode_pembayaran: string;
    jenis_member: string;
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
    } = useReportPage<StrukRows>({
        searchableFields: ["tanggal", "struk", "station", "kasir", "kd_member", "nama_member", "jenis_member", "metode_pembayaran"],
        numericFields: [
            "jumlah_produk",
            "total_qty",
            "total_gross",
            "total_netto",
            "total_margin",
        ],
        headers: [
            "Tanggal",
            "Struk",
            "Station",
            "Kasir",
            "Kode Member",
            "Nama Member",
            "Jenis Member",
            "Metode Pembayaran",
            "Jumlah Produk",
            "Total Qty",
            "Total Gross",
            "Total Netto",
            "Total Margin",
        ],
        mapRow: (row) => [
            row.tanggal,
            row.struk,
            row.station,
            row.kasir,
            row.kd_member,
            row.nama_member,
            Number(row.jumlah_produk),
            Number(row.total_qty),
            Number(row.total_gross),
            Number(row.total_netto),
            Number(row.total_margin),
        ],
    });

    const columns: { field: keyof StrukRows; label: string; isNumeric?: boolean }[] = [
        { field: "tanggal", label: "Tanggal" },
        { field: "struk", label: "Struk" },
        { field: "station", label: "Station" },
        { field: "kasir", label: "Kasir" },
        { field: "kd_member", label: "Kd Mem" },
        { field: "nama_member", label: "Nama Mem" },
        { field: "jenis_member", label: "Jenis Mem" },
        { field: "metode_pembayaran", label: "Metode Pembayaran" },
        { field: "jumlah_produk", label: "Jumlah Produk", isNumeric: true },
        { field: "total_qty", label: "Qty", isNumeric: true },
        { field: "total_gross", label: "Gross", isNumeric: true },
        { field: "total_netto", label: "Netto", isNumeric: true },
        { field: "total_margin", label: "Margin", isNumeric: true },
    ];

    // State for modal
    // Use a more specific type for selectedRow
    const [selectedRow, setSelectedRow] = useState<StrukRows | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = (row: StrukRows) => {
        setSelectedRow(row);
        setShowModal(true);
    };

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
                                keyField="struk"
                                showRowNumber={true}
                                textHeader="sm"
                                textFooter="sm"
                                textBody="sm"
                                isRefreshing={isRefreshing}
                                renderHeaderGroup={
                                    <tr>
                                        <th colSpan={9} className="border border-gray-400 px-2 py-2">
                                            Info Struk
                                        </th>
                                        <th colSpan={6} className="border border-gray-400 bg-red-400 px-2 py-2">
                                            Sales
                                        </th>
                                    </tr>
                                }
                                renderActions={(row) => (
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
                        <ProdukModal
                            show={showModal}
                            onClose={() => setShowModal(false)}
                            startDate={query.startDate as string}
                            endDate={query.endDate as string}
                            struk={selectedRow?.struk || ""}
                        />
                    </>}
            </section>
        </Layout>
    );
};

export default PerProdukPage;
