// hooks/useReportPage.ts

import { useState } from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { useRefreshRouter } from "@/hooks/useRefreshRouter";
import { useReportQueryEndpoint } from "@/hooks/useReportQueryEndpoint";
import { useReportTableLogic } from "@/hooks/useReportTableLogic";
import { useExportToExcel } from "@/hooks/useExportToExcel";

interface UseReportPageOptions<T> {
    basePath: string;
    searchableFields: (keyof T)[];
    numericFields: (keyof T)[];
    headers: string[];
    mapRow: (row: T) => (string | number | null)[];
    allFields: (keyof T)[];
}

export function useReportPage<T extends object>(
    options: UseReportPageOptions<T>
) {
    const { basePath, searchableFields, numericFields, headers, mapRow, allFields } = options;

    const { query, endpoint } = useReportQueryEndpoint({ basePath });
    const [searchTerm, setSearchTerm] = useState("");

    const { data, loading, error, refetch } = useFetchData<T[]>({
        endpoint,
        queryParams: query as Record<string, string>,
        enabled: !!endpoint, // hanya fetch jika endpoint sudah tersedia
    });

    const { isRefreshing, handleRefresh } = useRefreshRouter(loading, refetch);

    const { filteredData, title, periode, totalRow } = useReportTableLogic<T>(
        data ?? [],
        searchTerm,
        searchableFields,
        numericFields,
        allFields
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
