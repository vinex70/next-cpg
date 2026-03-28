// File: src/hooks/useFetchData.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import axiosClient from "@/lib/axiosClient";

interface UseFetchDataOptions {
    endpoint: string;
    queryParams?: Record<string, string | number | boolean>;
    enabled?: boolean; // untuk kontrol trigger
}

/**
 * Custom hook useFetchData untuk mengambil data dari API
 *
 * @param endpoint URL endpoint API
 * @param queryParams Objek query parameters
 * @param enabled Boolean untuk kontrol trigger
 * @returns Objek berisi data, error, dan loading
 */
export function useFetchData<T>({
    endpoint,
    queryParams,
    enabled = true,
}: UseFetchDataOptions) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const paramsString = useMemo(
        () => (queryParams ? JSON.stringify(queryParams) : ""),
        [queryParams]
    );

    const stableParams = useMemo(
        () =>
            paramsString
                ? (JSON.parse(paramsString) as Record<string, string | number | boolean>)
                : undefined,
        [paramsString]
    );

    const fetchData = useCallback(async () => {
        if (!endpoint) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axiosClient.get(endpoint, {
                params: stableParams,
            });

            setData(response.data.data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Fetch error:", err.message);
                setError(err.message);
            } else {
                console.error("Unknown error", err);
                setError("Unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    }, [endpoint, stableParams]);

    useEffect(() => {
        if (!enabled) return;
        fetchData();
    }, [endpoint, stableParams, enabled, fetchData]);

    // ✅ RETURN refetch
    return { data, error, loading, refetch: fetchData };
}
