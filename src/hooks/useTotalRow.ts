// hooks/useTotalRow.ts
import { useMemo } from "react";
import { formatNumber } from "@/utils/formatNumber";

export function useTotalRow<T>(
    data: T[] | undefined,
    identityFields: (keyof T)[],
    numericFields: (keyof T)[]
): (string | number)[] {
    return useMemo(() => {
        if (!data || data.length === 0) return [];

        const totalRow: (string | number)[] = [
            "TOTAL",
            ...identityFields.slice(1).map(() => ""), // "" untuk kolom identitas ke-2 dst
            ...numericFields.map((key) =>
                formatNumber(data.reduce((acc, row) => acc + Number(row[key] ?? 0), 0))
            ),
        ];

        return totalRow;
    }, [data, identityFields, numericFields]);
}
