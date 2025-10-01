// File: src/hooks/useFetchData.ts
import { useState, useEffect } from "react";
import axiosClient from "@/lib/axiosClient";

interface UseFetchDataOptions {
    endpoint: string;
    queryParams?: Record<string, string | number | boolean>;
    enabled?: boolean; // untuk kontrol trigger
}
/** 
 * Costum hook useFetchData untuk mengambil data dari API
 * 
 * @param endpoint URL endpoint API
 * @param queryParams Objek query parameters
 * @param enabled Boolean untuk kontrol trigger
 * @returns Objek berisi data, error, dan loading
 *  
 **/


// Custom hook useFetchData untuk mengambil data dari API
export function useFetchData<T>({ endpoint, queryParams, enabled = true }: UseFetchDataOptions) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const stringifiedQueryParams = JSON.stringify(queryParams);

    useEffect(() => {
        if (!enabled || !endpoint) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosClient.get(endpoint, {
                    params: queryParams,
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
        };

        fetchData();
    }, [endpoint, stringifiedQueryParams, enabled, queryParams]);
    return { data, error, loading };
}

