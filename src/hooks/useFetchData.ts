// File: src/hooks/useFetchData.ts
import { useState, useEffect, useMemo } from "react";
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

    // ✅ Gunakan useMemo agar queryParams tidak berubah referensi setiap render
    const stableParams = useMemo(() => queryParams, [JSON.stringify(queryParams)]);

    useEffect(() => {
        if (!enabled || !endpoint) return;

        let isMounted = true; // untuk mencegah update state setelah unmount

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosClient.get(endpoint, {
                    params: stableParams,
                });

                // Cek apakah komponen masih mounted
                if (isMounted) {
                    setData(response.data.data);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    if (err instanceof Error) {
                        console.error("Fetch error:", err.message);
                        setError(err.message);
                    } else {
                        console.error("Unknown error", err);
                        setError("Unknown error occurred");
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [endpoint, stableParams, enabled]);

    return { data, error, loading };
}
