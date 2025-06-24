import { Skeleton } from "@/components/ui/skeleton";

const SkeletonTable = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => {
    return (
        <div className="w-full border rounded-md overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-12 bg-gray-100 text-sm font-semibold p-3">
                {[...Array(columns)].map((_, colIndex) => (
                    <div key={colIndex} className="sm:col-span-1 px-2 py-1">
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>

            {[...Array(rows)].map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    className="grid grid-cols-1 sm:grid-cols-12 border-t px-3 py-2 items-center"
                >
                    {[...Array(columns)].map((_, colIndex) => (
                        <div key={colIndex} className="sm:col-span-1 px-2 py-1">
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default SkeletonTable;
