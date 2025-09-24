export function normalizeToArray(input?: string | string[]): string[] {
    if (!input) return [];
    if (Array.isArray(input)) {
        return input
            .flatMap(item => item.split(",").map(s => s.trim()))
            .filter(Boolean);
    }
    return input.split(",").map(s => s.trim()).filter(Boolean);
}
