// hooks/useReportQueryEndpoint.ts
import { useRouter } from "next/router";

export const useReportQueryEndpoint = () => {
    const router = useRouter();
    const query = router.query;

    const endpoint = query.selectedReport
        ? `/evaluasi-sales/${query.selectedReport}`
        : "";

    return { query, endpoint };
};