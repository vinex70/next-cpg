export function FormatTanggal(input: Date | string | undefined | null): string {
    if (!input) return "";

    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date.getTime())) return "";

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
}
