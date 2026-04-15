import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatNumber } from "../formatNumber";

type AutoTableDoc = jsPDF & {
    lastAutoTable?: {
        finalY: number;
    };
};

type ExportMode = "preview" | "download" | "print";

export function exportToPdf<T extends Record<string, unknown>>({
    title,
    columns,
    data,
    mode = "preview",
}: {
    title: string;
    columns: { label: string; field: keyof T }[];
    data: T[];
    mode?: ExportMode;
}) {
    // 🔥 FIX: pakai mm + A4 biar stabil di printer
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    // ===============================
    // 🔥 TITLE (CENTER biar aman)
    // ===============================
    doc.setFontSize(14);
    doc.text(title, pageWidth / 2, 15, { align: "center" });

    // ===============================
    // 🔥 COLUMN (No + Koreksi hanya PDF)
    // ===============================
    const tableColumn = [
        "No",
        ...columns.map((col) => col.label),
        "Koreksi",
    ];

    // ===============================
    // 🔥 BODY
    // ===============================
    const tableRows = data.map((row, index) => {
        const baseRow = columns.map((col) => {
            const value = row[col.field];
            return value !== null && value !== undefined
                ? String(value)
                : "";
        });

        return [
            index + 1,
            ...baseRow,
            "",
        ];
    });

    // ===============================
    // 🔥 TABLE
    // ===============================
    autoTable(doc, {
        startY: 20,
        head: [tableColumn],
        body: tableRows,
        margin: { left: margin, right: margin }, // 🔥 penting
        styles: {
            fontSize: 8,
        },
        columnStyles: {
            0: { halign: "center" },
            [tableColumn.length - 1]: { halign: "center" },
        },
    });

    // ===============================
    // 🔥 FOOTER
    // ===============================
    const finalY = (doc as AutoTableDoc).lastAutoTable?.finalY ?? 30;

    const leftValueX = 50;
    const leftColonX = leftValueX - 25;
    const leftLabelX = leftColonX - 2;

    const rightValueX = pageWidth - margin;
    const rightColonX = rightValueX - 25;
    const rightLabelX = rightColonX - 2;

    const startY = finalY + 12;
    const lineGap = 8;

    // garis pemisah
    doc.setDrawColor(150);
    doc.line(margin, finalY + 5, pageWidth - margin, finalY + 5);

    // ===============================
    // 🔥 HITUNG DATA
    // ===============================

    const lpp = data.length > 0 ? Number(data[0]["lpp"] ?? 0) : 0;

    const plano_qty = data.length > 0 ? Number(data[0]["plano_qty"] ?? 0) : 0;
    const omi_recid4 = data.length > 0 ? Number(data[0]["omi_recid4"] ?? 0) : 0;
    const qty_rom = data.length > 0 ? Number(data[0]["qty_rom"] ?? 0) : 0;

    const sumPlano = plano_qty + omi_recid4 + qty_rom;
    const selisih = sumPlano - lpp;

    const acost = data.length > 0 ? Number(data[0]["acost"] ?? 0) : 0;
    const flag = data.length > 0 ? String(data[0]["flag"] ?? "-") : "-";

    doc.setFontSize(10);

    const drawLeft = (label: string, value: string, y: number) => {
        doc.text(label, leftLabelX, y, { align: "right" });
        doc.text(":", leftColonX, y);
        doc.text(value, leftValueX, y, { align: "right" });
    };

    const drawRight = (label: string, value: string, y: number) => {
        doc.text(label, rightLabelX, y, { align: "right" });
        doc.text(":", rightColonX, y);
        doc.text(value, rightValueX, y, { align: "right" });
    };

    // kiri
    drawLeft("Acost", formatNumber(acost), startY);
    drawLeft("Flag", flag, startY + lineGap);

    // kanan
    drawRight("Total QTY Plano (a)", formatNumber(sumPlano), startY);
    drawRight("LPP (b)", formatNumber(lpp), startY + lineGap);
    drawRight("Selisih (a-b)", formatNumber(selisih), startY + lineGap * 2);

    // ===============================
    // 🔥 OUTPUT MODE (FIX NAMA FILE)
    // ===============================
    const fileName = `${title.replace(/\s+/g, "_")}.pdf`;

    if (mode === "download") {
        doc.save(fileName);
        return;
    }

    // 🔥 pakai blob (bukan bloburl)
    const blob = doc.output("blob");

    // buat URL
    const blobUrl = URL.createObjectURL(blob);

    if (mode === "preview") {
        const newWindow = window.open(blobUrl, "_blank");

        // optional: set title tab
        if (newWindow) {
            newWindow.document.title = fileName;
        }

        return;
    }

    if (mode === "print") {
        const printWindow = window.open(blobUrl);

        if (printWindow) {
            printWindow.onload = () => {
                printWindow.document.title = fileName; // 🔥 ini penting
                printWindow.print();
            };
        }
    }
}