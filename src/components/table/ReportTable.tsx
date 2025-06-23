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
    keyField?: keyof T | ((row: T) => string);
    renderActions?: (row: T) => React.ReactNode; // ✅ renamed for multi-action support
    actionHeaderLabel?: string; // ✅ optional action column title
    showRowNumber?: boolean;
    textHeader?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    textBody?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    textFooter?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    isRefreshing?: boolean; // ✅ optional prop to indicate if the table is refreshing
}

export function ReportTable<T extends Record<string, unknown>>({
    columns,
    data,
    totalRow,
    renderHeaderGroup,
    keyField,
    renderActions,
    actionHeaderLabel = "Actions", // ✅ default header for action column
    showRowNumber = false,
    textHeader,
    textBody,
    textFooter,
    isRefreshing = false, // ✅ default to false if not provided
}: ReportTableProps<T>) {
    const isArrayTotal = Array.isArray(totalRow);

    return (
        <div className="max-h-[60vh] overflow-y-auto shadow-xl rounded-md">
            <table className="min-w-full table-auto max-w-fit">
                <thead className="sticky top-0 z-10 bg-blue-400 border border-collapse border-gray-400">
                    {renderHeaderGroup}
                    <tr className={textHeader ? `text-${textHeader}` : "text-md"}>
                        {showRowNumber && (
                            <th className="border border-gray-400 px-2 py-2 text-center w-12">No</th>
                        )}
                        {columns.map((col, idx) => (
                            <th key={idx} className="border border-gray-400 px-2 py-2">{col.label}</th>
                        ))}
                        {renderActions && (
                            <th className="border border-gray-400 px-2 py-2 text-center">{actionHeaderLabel}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {isRefreshing ? (
                        <tr>
                            <td colSpan={columns.length + (showRowNumber ? 1 : 0) + (renderActions ? 1 : 0)}
                                className="text-center py-4">
                                <span className="animate-pulse text-gray-500">Refreshing...</span>
                            </td>
                        </tr>
                    )
                        :

                        data.map((row, rowIndex) => (
                            <tr className={textBody ? `text-${textBody}` : "text-sm"} key={
                                keyField
                                    ? typeof keyField === "function"
                                        ? keyField(row)
                                        : String(row[keyField])
                                    : rowIndex
                            }>
                                {showRowNumber && (
                                    <td className="border border-gray-400 px-2 py-2 text-center">
                                        {rowIndex + 1}
                                    </td>
                                )}
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`border border-gray-400 px-2 py-2 ${col.isNumeric ? "text-end" : ""}`}
                                    >
                                        {col.isNumeric
                                            ? formatNumber(Number(row[col.field]))
                                            : String(row[col.field] ?? "")}
                                    </td>
                                ))}
                                {renderActions && (
                                    <td className="border border-gray-400 text-center space-x-1">
                                        {renderActions(row)}
                                    </td>
                                )}
                            </tr>
                        ))
                    }


                </tbody>
                <tfoot>
                    <tr className={`font-semibold bg-white ${textFooter ? `text-${textFooter}` : "text-md"}`}>
                        {
                            isRefreshing ? null :
                                (() => {
                                    const nonNumericCols = columns.filter((col) => !col.isNumeric);
                                    const numericCols = columns.filter((col) => col.isNumeric);
                                    const totalRowArray = isArrayTotal ? (totalRow as (string | number)[]) : [];

                                    return (
                                        <>
                                            {showRowNumber && (
                                                <td className="border border-gray-400 px-2 py-2 dark:bg-blue-400" />
                                            )}
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
                                            {renderActions && (
                                                <td className="border border-gray-400 px-2 py-2 dark:bg-blue-400" />
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
