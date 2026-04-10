// src/components/DependentSelectWrapper.tsx
import { Control, FieldValues, FieldPath } from "react-hook-form";
import { useQueryData } from "@/hooks/useQueryData";
import { useDependentSelect } from "@/hooks/useDependentSelect";
import SelectTypeWrapper from "@/components/SelectTypeWrapper";

interface DependentSelectWrapperProps<
    T,
    FormType extends FieldValues
> {
    control: Control<FormType>;

    // 🔥 pakai FieldPath (bukan keyof)
    name: FieldPath<FormType>;
    parentName?: FieldPath<FormType>;

    endpoint: string;

    labelAll?: string;
    placeholder?: string;

    getOption: (item: T) => {
        label: string;
        value: string;
    };

    getGroupKey?: (item: T) => string;

    filterFn?: (item: T, parentValue: unknown) => boolean;

    sortGroups?: boolean;
    sortOptions?: boolean;

    enableSearch?: boolean;
}

export function DependentSelectWrapper<
    T,
    FormType extends FieldValues
>({
    control,
    name,
    parentName,
    endpoint,

    labelAll = "All",
    placeholder,

    getOption,
    getGroupKey,
    filterFn,

    sortGroups = true,
    sortOptions = true,

    enableSearch = false,

}: DependentSelectWrapperProps<T, FormType>) {
    const { data, error, isLoading } = useQueryData<T[]>({
        endpoint,
    });

    const { options, parentValue } = useDependentSelect<T, FormType>({
        control,
        name,
        parentName,
        data,

        filterFn,
        getOption,
        getGroupKey,

        includeAllOption: true,
        allLabel: labelAll,

        sortGroups,
        sortOptions,

    });

    return (
        <SelectTypeWrapper<FormType>
            control={control}
            name={name} // ✅ no any
            data={options}
            loading={isLoading}
            error={!!error}
            placeholder={
                parentName
                    ? parentValue
                        ? placeholder ?? "Pilih data"
                        : labelAll
                    : placeholder ?? labelAll
            }
            valueKeyTransform={(val) => (val === "__ALL__" ? "" : val)}
            enableSearch={enableSearch}
        />
    );
}