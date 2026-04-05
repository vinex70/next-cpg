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
    enabled?: boolean;
}

export function useReportPage<T extends object>(
    options: UseReportPageOptions<T> & {
        customFetch?: {
            endpoint: string;
            queryParams?: Record<string, string>;
            enabled?: boolean;
        };
    }
) {
    const {
        basePath,
        searchableFields,
        numericFields,
        headers,
        mapRow,
        allFields,
        enabled,
        customFetch
    } = options;

    // ✅ SELALU DIPANGGIL (fix error React Hook)
    const routerResult = useReportQueryEndpoint({ basePath });

    // ✅ pilih data setelah hook dipanggil
    const endpoint = customFetch?.endpoint ?? routerResult.endpoint;
    const query = customFetch?.queryParams ?? routerResult.query;

    const [searchTerm, setSearchTerm] = useState("");

    const { data, loading, error, refetch } = useFetchData<T[]>({
        endpoint,
        queryParams: query as Record<string, string>,
        enabled: customFetch?.enabled ?? (enabled !== undefined ? enabled : !!endpoint),
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
        data: filteredData ?? [],
        mapRow: (row: T) => mapRow(row).map(cell => cell ?? ""),
        totalRow,
        columns: allFields.map((field) => ({
            field,
            label: headers[allFields.indexOf(field)],
            isNumeric: numericFields.includes(field),
        })),
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
