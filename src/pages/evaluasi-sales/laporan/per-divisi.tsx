// pages/evaluasi-sales/laporan/per-divisi.tsx
import { useState } from "react";
// components
import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { useReportPage } from "@/hooks/useReportPage";
import { ReportTable } from "@/components/table/ReportTable";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProdukTanggalModal from "@/components/modal/evaluasi-sales/ProdukTanggalModal";
import ProdukModal from "@/components/modal/evaluasi-sales/ProdukModal";
import StrukModal from "@/components/modal/evaluasi-sales/StrukModal";
import LoadingIgr from "@/components/LoadingIgr";

type DivisiRow = {
    div: string;
    nama_div: string;
    jumlah_member: number;
    jumlah_struk: number;
    jumlah_produk: number;
    total_qty: number;
    total_gross: number;
    total_netto: number;
    total_margin: number;
};

const PerDivisiPage = () => {
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
    } = useReportPage<DivisiRow>({
        searchableFields: ["div", "nama_div"],
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
            "Nama Div",
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
            row.nama_div,
            Number(row.jumlah_member),
            Number(row.jumlah_struk),
            Number(row.jumlah_produk),
            Number(row.total_qty),
            Number(row.total_gross),
            Number(row.total_netto),
            Number(row.total_margin),
        ]
    })

    const columns: { field: keyof DivisiRow; label: string; isNumeric?: boolean }[] = [
        { field: "div", label: "Div" },
        { field: "nama_div", label: "Nama Div" },
        { field: "jumlah_member", label: "Member", isNumeric: true },
        { field: "jumlah_struk", label: "Struk", isNumeric: true },
        { field: "jumlah_produk", label: "Produk", isNumeric: true },
        { field: "total_qty", label: "Qty", isNumeric: true },
        { field: "total_gross", label: "Gross", isNumeric: true },
        { field: "total_netto", label: "Netto", isNumeric: true },
        { field: "total_margin", label: "Margin", isNumeric: true },
    ]

    const [selectedRow, setSelectedRow] = useState<DivisiRow | null>(null);
    const [showProdukModal, setShowProdukModal] = useState(false);
    const [showProdukTanggalModal, setShowProdukTanggalModal] = useState(false);
    const [showStrukModal, setShowStrukModal] = useState(false);

    const handleOpenProdukTanggalModal = (row: DivisiRow) => {
        setSelectedRow(row);
        setShowProdukTanggalModal(true);
    };

    const handleOpenStrukModal = (row: DivisiRow) => {
        setSelectedRow(row);
        setShowStrukModal(true);
    };

    const handleOpenProdukModal = (row: DivisiRow) => {
        setSelectedRow(row);
        setShowProdukModal(true);
    };

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
                            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search..." />
                        </div>

                        {error && <p className="text-red-500">{error}</p>}

                        {!error && filteredData && (
                            <ReportTable
                                columns={columns}
                                data={filteredData}
                                totalRow={totalRow}
                                keyField={(row) => `${row.div}-${row.nama_div}`}
                                showRowNumber={true}
                                isRefreshing={isRefreshing}
                                renderHeaderGroup={
                                    <tr>
                                        <th colSpan={3} className="border border-gray-400 px-2 py-2">
                                            Divisi
                                        </th>
                                        <th colSpan={8} className="border border-gray-400 px-2 py-2">
                                            Sales
                                        </th>
                                    </tr>
                                }
                                renderActions={(row) => (
                                    <DropdownMenu dir="rtl">
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="link" size={"sm"} className="text-blue-600 hover:cursor-pointer">Detail</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <Button
                                                        variant="link"
                                                        onClick={() => handleOpenProdukTanggalModal(row)}
                                                        className="text-blue-600 hover:underline hover:cursor-pointer"
                                                    >
                                                        Produk Per Tanggal
                                                    </Button>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Button
                                                        variant="link"
                                                        onClick={() => handleOpenProdukModal(row)}
                                                        className="text-blue-600 hover:underline hover:cursor-pointer"
                                                    >
                                                        Produk
                                                    </Button>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem >
                                                    <Button
                                                        variant="link"
                                                        onClick={() => handleOpenStrukModal(row)}
                                                        className="text-blue-600 hover:underline hover:cursor-pointer"
                                                    >
                                                        Struk
                                                    </Button>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
                        />

                        <ProdukModal
                            show={showProdukModal}
                            onClose={() => setShowProdukModal(false)}
                            startDate={query.startDate as string}
                            endDate={query.endDate as string}
                            div={selectedRow?.div as string}
                        />

                        {/* Modal Struk */}
                        <StrukModal
                            show={showStrukModal}
                            onClose={() => setShowStrukModal(false)}
                            startDate={query.startDate as string}
                            endDate={query.endDate as string}
                            div={selectedRow?.div as string}
                        />
                    </>}

            </section>
        </Layout>
    );
};

export default PerDivisiPage;
