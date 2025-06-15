// File: src/hooks/useFetchData.ts
import { useState, useEffect } from "react";
import axiosClient from "@/lib/axiosClient";

interface UseFetchDataOptions {
    endpoint: string;
    queryParams?: Record<string, string | number | boolean>;
    enabled?: boolean; // untuk kontrol trigger
}

export function useFetchData<T>({ endpoint, queryParams, enabled = true }: UseFetchDataOptions) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Extract stringified queryParams to avoid complex expressions in dependency array
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
                setData(response.data.data); // asumsi bentuk respons: { data: ... }
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
