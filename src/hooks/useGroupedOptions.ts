import { useMemo } from "react";

export interface Option {
    label: string;
    value: string;
}

export interface GroupedOption {
    groupLabel: string;
    options: Option[];
}

interface UseGroupedOptionsProps<T> {
    data?: T[];
    getGroupKey: (item: T) => string;
    getOption: (item: T) => Option;
}

/**
 * 🔥 Hook reusable untuk grouping select option
 * @param data
 * @param getGroupKey
 * @param getOption
 * @returns
 */
export function useGroupedOptions<T>({
    data,
    getGroupKey,
    getOption,
    sortGroups = false,
    sortOptions = false,
}: UseGroupedOptionsProps<T> & {
    sortGroups?: boolean;
    sortOptions?: boolean;
}): GroupedOption[] {
    return useMemo(() => {
        if (!data || data.length === 0) return [];

        const grouped = data.reduce<Record<string, GroupedOption>>(
            (acc, item) => {
                const key = getGroupKey(item);

                if (!acc[key]) {
                    acc[key] = {
                        groupLabel: key,
                        options: [],
                    };
                }

                acc[key].options.push(getOption(item));

                return acc;
            },
            {}
        );

        let result = Object.values(grouped);

        // 🔥 sort options dalam group
        if (sortOptions) {
            result = result.map((group) => ({
                ...group,
                options: [...group.options].sort((a, b) =>
                    a.label.localeCompare(b.label)
                ),
            }));
        }

        // 🔥 sort group
        if (sortGroups) {
            result = result.sort((a, b) =>
                a.groupLabel.localeCompare(b.groupLabel)
            );
        }

        return result;
    }, [data, getGroupKey, getOption, sortGroups, sortOptions]);
}