// hooks/useReportQueryEndpoint.ts
import { useRouter } from "next/router";

type UseReportQueryEndpointProps = {
    basePath: string; // contoh: 'evaluasi-sales' atau 'informasi-promosi'
};

export const useReportQueryEndpoint = ({ basePath }: UseReportQueryEndpointProps) => {
    const router = useRouter();
    const query = router.query;

    // handle string | string[]
    const report = Array.isArray(query.selectedReport)
        ? query.selectedReport[0]
        : query.selectedReport;

    const endpoint = report
        ? `/${basePath}/${report}`
        : "";

    return { query, endpoint };
};