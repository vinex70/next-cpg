import { FilterFormSoHarianInput } from "@/schema/filterFormSoHarian";
import { normalizeToArray } from "@/utils/normalizeToArray";

export const FilterFormSoHarian = (filters: FilterFormSoHarianInput) => {
    const conditions = [];
    const params = [];

    const plu = normalizeToArray(filters.plu);
    if (plu.length > 0) {
        if (plu.length === 1) {
            conditions.push(`plu = $${params.length + 1}`);
            params.push(plu[0]);
        } else {
            conditions.push(`plu = ANY($${params.length + 1})`);
            params.push(plu);
        }
    }

    return {
        conditions:
            conditions.length > 0 ? `where ${conditions.join(" AND ")}` : "",
        params,
    };
};

export const parseFiltersFormSoHarian = (query: Partial<FilterFormSoHarianInput>) => {
    const { ...rest } = query;

    return {
        ...rest,
    }
}