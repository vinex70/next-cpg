import { useRouter } from "next/router";

type UseReportQueryEndpointProps = {
    basePath: string;
};

export const useReportQueryEndpoint = ({ basePath }: UseReportQueryEndpointProps) => {
    const router = useRouter();
    const query = router.query;

    const report = Array.isArray(query.selectedReport)
        ? query.selectedReport[0]
        : query.selectedReport;

    // 🔥 FIX: fallback kalau tidak ada report
    const endpoint = report
        ? `/${basePath}/${report}`
        : `/${basePath}`;

    return { query, endpoint };
};