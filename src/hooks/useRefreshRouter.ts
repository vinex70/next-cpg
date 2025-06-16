// hooks/useRefreshRouter.ts
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export const useRefreshRouter = (loading: boolean) => {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await router.replace(router.asPath);
    };

    useEffect(() => {
        if (!loading) {
            setIsRefreshing(false);
        }
    }, [loading]);

    return { isRefreshing, handleRefresh };
};
