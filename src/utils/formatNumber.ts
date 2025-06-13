// utils/formatAngka.ts

export function formatNumber(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}
