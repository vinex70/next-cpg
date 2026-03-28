// hooks/useTotalRow.ts
import { useMemo } from "react";
import { formatNumber } from "@/utils/formatNumber";

export function useTotalRow<T>(
    data: T[] | undefined,
    identityFields: (keyof T)[],
    numericFields: (keyof T)[],
    allFields: (keyof T)[] // ✅ Tambah parameter ini
): (string | number)[] {
    return useMemo(() => {
        if (!data || data.length === 0) return [];

        const totalRow: (string | number)[] = [
            "TOTAL",
            // Empty untuk identity fields (selain yang pertama)
            ...identityFields.slice(1).map(() => ""),
            // Numeric totals
            ...numericFields.map((key) =>
                formatNumber(data.reduce((acc, row) => acc + Number(row[key] ?? 0), 0))
            ),
            // ✅ Empty untuk sisa kolom non-numeric di akhir
            ...allFields
                .filter((field) => !identityFields.includes(field) && !numericFields.includes(field))
                .map(() => ""),
        ];

        return totalRow;
    }, [data, identityFields, numericFields, allFields]);
}