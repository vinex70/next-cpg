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
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type ProdukRows = {
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
    } = useReportPage<ProdukRows>({
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

    const columns: { field: keyof ProdukRows; label: string; isNumeric?: boolean }[] = [
        { field: "tanggal", label: "Tgl" },
        { field: "jumlah_member", label: "Member", isNumeric: true },
        { field: "jumlah_struk", label: "Struk", isNumeric: true },
        { field: "total_qty", label: "Qty", isNumeric: true },
        { field: "total_gross", label: "Gross", isNumeric: true },
        { field: "total_netto", label: "Netto", isNumeric: true },
        { field: "total_margin", label: "Margin", isNumeric: true },
    ];

    // Modal state
    const [selectedRow, setSelectedRow] = useState<ProdukRows | null>(null);
    const [showProdukModal, setShowProdukModal] = useState(false);
    const [showProdukTanggalModal, setShowProdukTanggalModal] = useState(false);
    const [showStrukModal, setShowStrukModal] = useState(false);

    const convertToISODate = (dateStr: string): string => {
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`;
    };

    const handleOpenProdukTanggalModal = (row: ProdukRows) => {
        setSelectedRow(row);
        setShowProdukTanggalModal(true);
    };

    const handleOpenStrukModal = (row: ProdukRows) => {
        setSelectedRow(row);
        setShowStrukModal(true);
    };

    const handleOpenProdukModal = (row: ProdukRows) => {
        setSelectedRow(row);
        setShowProdukModal(true);
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

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && filteredData && (
                    <ReportTable
                        columns={columns}
                        data={filteredData}
                        totalRow={totalRow}
                        keyField="tanggal"
                        showRowNumber
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
            </section>
        </Layout>
    );
};

export default PerTanggalPage;
