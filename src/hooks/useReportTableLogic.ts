// hooks/useReportTableLogic.ts
import { useFilteredData } from "./useFilteredData";
import { useTitleFromQuery } from "./useTitleFromQuery";
import { useTotalRow } from "./useTotalRow";
import { formatReportPeriod } from "@/utils/formatReportPeriode";
import { useRouter } from "next/router";

export const useReportTableLogic = <T extends object>(
    data: T[] | undefined,
    searchTerm: string,
    excludeTotalFields: (keyof T)[],
    totalFields: (keyof T)[]
) => {
    const filteredData = useFilteredData(data ?? undefined, searchTerm);
    const title = useTitleFromQuery();
    const router = useRouter();
    const query = router.query;
    const periode = formatReportPeriod(
        query.startDate as string,
        query.endDate as string
    );

    const totalRow = useTotalRow<T>(
        filteredData,
        excludeTotalFields,
        totalFields
    );

    return { filteredData, title, periode, totalRow };
};