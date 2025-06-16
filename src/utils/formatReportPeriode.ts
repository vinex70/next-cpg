// utils/formatReportPeriod.ts
import { FormatTanggal } from "./formatTanggal";

export const formatReportPeriod = (start?: string, end?: string) =>
    `Periode: ${FormatTanggal(start)} s/d ${FormatTanggal(end)}`;
