import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

type Column = {
    label: string;
    isNumeric?: boolean;
};

export const exportToStyledExcel = async ({
    title,
    columns,
    rows,
    totalRow,
    fileName = "exported.xlsx",
}: {
    title: string;
    columns: Column[];
    rows: (string | number | null)[][];
    totalRow?: (string | number | null)[];
    fileName?: string;
}) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan");

    const headers = columns.map((c) => c.label);
    const colCount = headers.length;

    // ================= TITLE =================
    worksheet.mergeCells(1, 1, 1, colCount);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.value = title;
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCCE5FF" },
    };

    // ================= HEADER =================
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

    // ================= DATA =================
    rows.forEach((row) => worksheet.addRow(row));

    // ================= TOTAL =================
    if (totalRow && totalRow.length > 0) {
        const totalRowRef = worksheet.addRow(totalRow);
        const totalRowNumber = totalRowRef.number;

        // 🔥 cari kolom numeric pertama
        const firstNumericIndex = columns.findIndex(c => c.isNumeric);

        // 🔥 merge sampai sebelum numeric
        const mergeUntil = firstNumericIndex > 0 ? firstNumericIndex : 1;

        // 🔥 merge cell
        worksheet.mergeCells(
            totalRowNumber,
            1,
            totalRowNumber,
            mergeUntil
        );

        // 🔥 isi TOTAL
        const totalCell = worksheet.getCell(totalRowNumber, 1);
        totalCell.value = "TOTAL";

        // 🔥 FIX: center semua cell dalam merge
        for (let col = 1; col <= mergeUntil; col++) {
            const cell = worksheet.getCell(totalRowNumber, col);

            cell.font = { bold: true };

            cell.alignment = {
                horizontal: "center",
                vertical: "middle",
            };

            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFB7DEE8" },
            };

            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        }

        // 🔥 style kolom numeric (kanan)
        for (let col = mergeUntil + 1; col <= colCount; col++) {
            const cell = worksheet.getCell(totalRowNumber, col);

            cell.font = { bold: true };

            cell.alignment = {
                horizontal: "right",
                vertical: "middle",
            };

            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFB7DEE8" },
            };

            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        }
    }

    // ================= STYLE DATA =================
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber >= 3) {
            row.eachCell((cell, colNumber) => {
                const isNumeric = columns[colNumber - 1]?.isNumeric;

                cell.alignment = {
                    vertical: "middle",
                    horizontal: isNumeric ? "right" : "left",
                };

                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        }
    });

    // ================= AUTO WIDTH =================
    worksheet.columns.forEach((column) => {
        let maxLength = 0;

        column.eachCell?.({ includeEmpty: true }, (cell) => {
            const val = cell.value ? cell.value.toString() : "";
            maxLength = Math.max(maxLength, val.length);
        });

        column.width = maxLength + 2;
    });

    // ================= DOWNLOAD =================
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, fileName);
};