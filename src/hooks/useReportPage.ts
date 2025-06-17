import { useState } from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { useRefreshRouter } from "@/hooks/useRefreshRouter";
import { useReportQueryEndpoint } from "@/hooks/useReportQueryEndpoint";
import { useReportTableLogic } from "@/hooks/useReportTableLogic";
import { useExportToExcel } from "@/hooks/useExportToExcel";

interface UseReportPageOptions<T> {
    searchableFields: (keyof T)[];
    numericFields: (keyof T)[];
    headers: string[];
    mapRow: (row: T) => (string | number | null)[];
}

export function useReportPage<T extends object>(
    options: UseReportPageOptions<T>
) {
    const { searchableFields, numericFields, headers, mapRow } = options;

    const { query, endpoint } = useReportQueryEndpoint();
    const [searchTerm, setSearchTerm] = useState("");

    const { data, loading, error } = useFetchData<T[]>({
        endpoint,
        queryParams: query as Record<string, string>,
        enabled: !!query.selectedReport,
    });

    const { isRefreshing, handleRefresh } = useRefreshRouter(loading);

    const { filteredData, title, periode, totalRow } = useReportTableLogic<T>(
        data ?? [],
        searchTerm,
        searchableFields,
        numericFields
    );

    const { handleExport } = useExportToExcel<T>({
        title,
        headers,
        data: filteredData ?? [],
        mapRow: (row: T) => mapRow(row).map(cell => cell === null ? "" : cell),
        totalRow,
    });

    return {
        query,
        searchTerm,
        setSearchTerm,
        data,
        filteredData,
        loading,
        error,
        title,
        periode,
        totalRow,
        handleExport,
        isRefreshing,
        handleRefresh,
    };
}
