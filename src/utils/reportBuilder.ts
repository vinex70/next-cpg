// utils/reportBuilder.ts
import { ColumnConfig } from "@/types/report";

export function buildReport<T>(columns: ColumnConfig<T>[]) {
    const allFields = columns.map(c => c.field);

    const numericFields = columns
        .filter(c => c.isNumeric)
        .map(c => c.field);

    const searchableFields = columns
        .filter(c => c.isSearchable)
        .map(c => c.field);

    const headers = allFields;

    const mapRow = (row: T) =>
        columns.map(col =>
            col.isNumeric ? Number(row[col.field]) : row[col.field]
        );

    const tableColumns = columns.map(c => ({
        field: c.field,
        label: c.label,
        isNumeric: c.isNumeric,
    }));

    // 🔥 AUTO HEADER GROUP
    const headerGroups = buildHeaderGroups(columns);

    return {
        allFields,
        numericFields,
        searchableFields,
        headers,
        mapRow,
        tableColumns,
        headerGroups,
    };
}

function buildHeaderGroups<T>(columns: ColumnConfig<T>[]) {
    const groups: { name: string; span: number }[] = [];

    let currentGroup = "";
    let count = 0;

    columns.forEach((col, index) => {
        const group = col.group || "Others";

        if (group !== currentGroup) {
            if (currentGroup) {
                groups.push({ name: currentGroup, span: count });
            }
            currentGroup = group;
            count = 1;
        } else {
            count++;
        }

        // push last
        if (index === columns.length - 1) {
            groups.push({ name: group, span: count });
        }
    });

    return groups;
}