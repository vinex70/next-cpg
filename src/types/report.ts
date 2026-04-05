// types/report.ts

export type ColumnConfig<T> = {
    field: keyof T;
    label: string;
    isNumeric?: boolean;
    isSearchable?: boolean;
    group?: string;
    groupColor?: string; // 🔥 tambah ini
};