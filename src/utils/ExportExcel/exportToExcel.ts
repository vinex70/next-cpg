import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToStyledExcel = async ({
    title,
    headers,
    rows,
    totalRow,
    fileName = "exported.xlsx",
}: {
    title: string;
    headers: string[];
    rows: (string | number | null)[][];
    totalRow?: (string | number | null)[];
    fileName?: string;
}) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan");

    const colCount = headers.length;
    const endCol = String.fromCharCode(65 + colCount - 1);

    // Title
    worksheet.mergeCells(`A1:${endCol}1`);
    const titleCell = worksheet.getCell("A1");
    titleCell.value = title;
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCCE5FF" },
    };

    // Header
    worksheet.addRow(headers);
    const headerRow = worksheet.getRow(2);
    headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF00B0F0" },
        };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Data
    rows.forEach((row) => worksheet.addRow(row));

    // Total row (opsional)
    if (totalRow) {
        worksheet.addRow(totalRow);
    }

    // Style all data rows
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber >= 3) {
            row.eachCell((cell) => {
                let horizontal: "center" | "left" | "right" = "center";
                if (typeof cell.value === "number") {
                    horizontal = "right";
                } else if (typeof cell.value === "string") {
                    horizontal = "left";
                }

                cell.alignment = { vertical: "middle", horizontal };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        }
    });


    // Auto width
    worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell?.({ includeEmpty: true }, (cell) => {
            const cellValue = cell.value ? cell.value.toString() : "";
            maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength + 2;
    });

    // Download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, fileName);
};
