// hooks/useExportToExcel.ts
import { exportToStyledExcel } from "@/utils/ExportExcel/exportToExcel";
import getDays from "@/hooks/getDays";

export const useExportToExcel = <T extends object>({
    title,
    headers,
    data,
    mapRow,
    totalRow,
}: {
    title: string;
    headers: string[];
    data: T[];
    mapRow: (row: T) => (string | number | null)[];
    totalRow: (string | number | null)[];
}) => {
    const handleExport = async () => {
        const rows = data.map(mapRow);
        await exportToStyledExcel({
            title: `Laporan ${title}`,
            headers,
            rows,
            totalRow,
            fileName: `Laporan_${title}_${getDays()}.xlsx`,
        });
    };

    return { handleExport };
};