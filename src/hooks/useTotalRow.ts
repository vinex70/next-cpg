// hooks/useTotalRow.ts
import { useMemo } from "react";
import { formatNumber } from "@/utils/formatNumber";


export function useTotalRow<T>(
    data: T[] | undefined,
    identityFields: (keyof T)[],
    numericFields: (keyof T)[],
    allFields: (keyof T)[]
): (string | number)[] {
    return useMemo(() => {
        if (!data || data.length === 0) return [];

        return allFields.map((field, index) => {
            // Kolom pertama → TOTAL
            if (index === 0) return "TOTAL";

            // Identity field → kosong
            if (identityFields.includes(field)) return "";

            // Numeric field → hitung total
            if (numericFields.includes(field)) {
                const total = data.reduce(
                    (acc, row) => acc + Number(row[field] ?? 0),
                    0
                );
                return formatNumber(total);
            }

            // Sisanya → kosong
            return "";
        });
    }, [data, identityFields, numericFields, allFields]);
}
