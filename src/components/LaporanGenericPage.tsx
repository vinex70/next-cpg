// LaporanGenericPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { FormatTanggal } from "@/utils/formatTanggal";
import { exportToStyledExcel } from "@/utils/ExportExcel/exportToExcel";
import { formatNumber } from "@/utils/formatNumber";
import getDays from "@/hooks/getDays";
import { useFetchData } from "@/hooks/useFetchData";
import { useFilteredData } from "@/hooks/useFilteredData";
import ButtonExportExcel from "@/components/ButtonExportExcel";
import ButtonRefresh from "@/components/ButtonRefresh";
import SearchInput from "@/components/SearchInput";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Props untuk konfigurasi laporan
export type ColumnConfig<T> = {
    label: string;
    field: keyof T;
    align?: "start" | "center" | "end";
    isNumber?: boolean;
    group?: string;
};

type LaporanGenericPageProps<T extends Record<string, string | number>> = {
    title?: string;
    endpoint: string;
    rowKey: keyof T;
    headers: string[];
    columns: ColumnConfig<T>[];
};

export default function LaporanGenericPage<T extends Record<string, string | number>>({
    title,
    endpoint,
    rowKey,
    headers,
    columns,
}: LaporanGenericPageProps<T>) {
    const router = useRouter();
    const query = router.query;
    const [searchTerm, setSearchTerm] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedRow, setSelectedRow] = useState<T | null>(null);

    const { data, loading, error } = useFetchData<T[]>({
        endpoint,
        queryParams: query as Record<string, string>,
        enabled: !!endpoint,
    });

    const filteredData = useFilteredData<T>(data ?? undefined, searchTerm);

    const totalRow = useMemo(() => {
        if (!filteredData) return [];
        return columns.map((col, idx) => {
            if (idx === 0) return "TOTAL";
            if (col.isNumber) {
                const total = filteredData.reduce((sum, row) => sum + Number(row[col.field] ?? 0), 0);
                return formatNumber(total);
            }
            return "";
        });
    }, [filteredData, columns]);

    const handleExport = async () => {
        if (!filteredData) return;
        const rows = filteredData.map((row) =>
            columns.map((col) =>
                col.isNumber ? formatNumber(Number(row[col.field])) : row[col.field]
            )
        );
        await exportToStyledExcel({
            title: `Laporan ${title}`,
            headers,
            rows,
            totalRow,
            fileName: `Laporan_${title}_${getDays()}.xlsx`,
        });
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await router.replace(router.asPath);
    };

    useEffect(() => {
        if (!loading) setIsRefreshing(false);
    }, [loading]);

    const groupedHeaders = useMemo(() => {
        const groups: { [group: string]: number } = {};
        const noGroup: number[] = [];
        columns.forEach((col, idx) => {
            if (col.group) {
                groups[col.group] = (groups[col.group] ?? 0) + 1;
            } else {
                noGroup.push(idx);
            }
        });
        return { groups, noGroup };
    }, [columns]);

    return (
        <Layout title={title}>
            <div className="space-y-4 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-green-600">📊 Laporan {title}</h1>
                        <p>
                            Periode: {FormatTanggal(query.startDate?.toString())} s/d {FormatTanggal(query.endDate?.toString())}
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <ButtonExportExcel handleExport={handleExport} />
                        <ButtonRefresh disabled={isRefreshing} onClick={handleRefresh} isRefreshing={isRefreshing} />
                    </div>
                </div>

                <div className="flex justify-end">
                    <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search..." />
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && filteredData && (
                    <Table className="border bg-white dark:bg-gray-900 shadow-xl">
                        <TableHeader className="border sticky top-0 z-10">
                            <TableRow className="border bg-blue-400 dark:bg-blue-600 hover:bg-blue-500">
                                {columns.map((col, i) => {
                                    const rowspan = col.group ? 1 : 2;
                                    const colspan = col.group ? groupedHeaders.groups[col.group] ?? 1 : 1;
                                    const alreadyRendered = col.group && columns.findIndex((c) => c.group === col.group) !== i;
                                    if (alreadyRendered) return null;
                                    return (
                                        <TableHead key={`group-${i}`} className="text-center border" colSpan={colspan} rowSpan={rowspan}>
                                            {col.group ?? col.label}
                                        </TableHead>
                                    );
                                })}
                                <TableHead className="text-center border" rowSpan={2}>Action</TableHead>
                            </TableRow>

                            <TableRow className="border bg-blue-400 dark:bg-blue-600 hover:bg-blue-500">
                                {columns.map((col, i) => {
                                    if (col.group) {
                                        return <TableHead key={`label-${i}`} className={`text-${col.align ?? "center"} border`}>{col.label}</TableHead>;
                                    }
                                    return null;
                                })}
                            </TableRow>
                        </TableHeader>

                        <TableBody className="border dark:bg-gray-800">
                            {filteredData.length > 0 ? (
                                filteredData.map((row) => (
                                    <TableRow key={row[rowKey] as string} className="border">
                                        {columns.map((col, i) => (
                                            <TableCell key={i} className={`text-${col.align ?? (col.isNumber ? "end" : "center")} border`}>
                                                {col.isNumber ? formatNumber(Number(row[col.field])) : row[col.field]}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-center border">
                                            <Button size="sm" variant="secondary" onClick={() => setSelectedRow(row)}>Detail</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="text-center text-gray-500 py-4">
                                        Tidak ada data untuk periode ini
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                {totalRow.map((val, i) => (
                                    <TableCell key={i} className={`border text-${i < 2 ? "center" : "end"} font-bold`}>
                                        {val}
                                    </TableCell>
                                ))}
                                <TableCell className="border font-bold text-center">-</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                )}
            </div>

            {/* Modal Detail */}
            <Dialog open={!!selectedRow} onOpenChange={() => setSelectedRow(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detail</DialogTitle>
                    </DialogHeader>
                    {selectedRow && (
                        <div className="space-y-1">
                            {columns.map((col) => (
                                <div key={String(col.field)} className="flex justify-between border-b py-1">
                                    <span className="font-semibold">{col.label}</span>
                                    <span>
                                        {col.isNumber ? formatNumber(Number(selectedRow[col.field])) : selectedRow[col.field]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
