// src/components/table/ReportTable.tsx
import { formatNumber } from "@/utils/formatNumber";
import React from "react";

interface Column<T> {
    field: keyof T;
    label: string;
    isNumeric?: boolean;
}

interface ReportTableProps<T> {
    columns: Column<T>[];
    data: T[];
    totalRow: T | (string | number)[];
    renderHeaderGroup?: React.ReactNode;
    keyField?: keyof T;
    renderAction?: (row: T) => React.ReactNode;
}

export function ReportTable<T extends Record<string, unknown>>({
    columns,
    data,
    totalRow,
    renderHeaderGroup,
    keyField,
    renderAction,
}: ReportTableProps<T>) {
    const isArrayTotal = Array.isArray(totalRow);

    return (
        <div className="max-h-[70vh] overflow-y-auto shadow-xl">
            <table className="table-fixed border-collapse border-gray-400 max-w-fit">
                <thead className="sticky top-0 z-10 bg-blue-400 border border-collapse border-gray-400">
                    {renderHeaderGroup}
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className="border border-gray-400 px-2 py-2">{col.label}</th>
                        ))}
                        {renderAction && (
                            <th className="border border-gray-400 px-2 py-2">Action</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={keyField ? String(row[keyField]) : rowIndex}>
                            {columns.map((col, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`border border-gray-400 px-2 py-2 text-sm ${col.isNumeric ? "text-end" : ""}`}
                                >
                                    {col.isNumeric
                                        ? formatNumber(Number(row[col.field]))
                                        : String(row[col.field] ?? "")}
                                </td>
                            ))}
                            {renderAction && (
                                <td className="border border-gray-400 px-2 py-2 text-center text-sm">
                                    {renderAction(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-semibold bg-white">
                        {(() => {
                            const nonNumericCols = columns.filter((col) => !col.isNumeric);
                            const numericCols = columns.filter((col) => col.isNumeric);
                            const totalRowArray = isArrayTotal ? (totalRow as (string | number)[]) : [];

                            return (
                                <>
                                    <td
                                        colSpan={nonNumericCols.length}
                                        className="border border-gray-400 px-2 py-2 text-center dark:bg-blue-400"
                                    >
                                        TOTAL
                                    </td>
                                    {numericCols.map((col, idx) => {
                                        const value = isArrayTotal
                                            ? totalRowArray[nonNumericCols.length + idx]
                                            : (totalRow as T)[col.field];

                                        const isValidNumber =
                                            col.isNumeric && typeof value === "number" && !isNaN(value);

                                        return (
                                            <td
                                                key={col.field as string}
                                                className="border border-gray-400 px-2 py-2 text-end dark:bg-blue-400"
                                            >
                                                {isValidNumber ? formatNumber(value as number) : String(value ?? "")}
                                            </td>
                                        );
                                    })}
                                    {renderAction && (
                                        <td className="border border-gray-400 px-2 py-2 dark:bg-blue-400"></td>
                                    )}
                                </>
                            );
                        })()}
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
