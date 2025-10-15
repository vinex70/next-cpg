import { Controller, Control, FieldValues, Path } from "react-hook-form";
import SelectType from "@/components/SelectType";

interface Option {
    label: string;
    value: string;
}

interface GroupedOption {
    groupLabel: string;
    options: Option[];
}

interface SelectTypeWrapperProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    data?: (Option | GroupedOption)[];
    loading?: boolean;
    error?: boolean;
    placeholder?: string;
    disabled?: boolean;
    /** 
     * Fungsi opsional untuk mengubah nilai yang dipilih (contoh: "__ALL__" → "")
     */
    valueKeyTransform?: (val: string) => string;
}

/**
 * Komponen wrapper serbaguna untuk SelectType
 * - Menangani state loading & error secara otomatis
 * - Mendukung flat & grouped options
 * - Tipe aman (tidak ada any)
 */
const SelectTypeWrapper = <T extends FieldValues>({
    control,
    name,
    data = [],
    loading = false,
    error = false,
    placeholder = "Pilih Opsi",
    disabled = false,
    valueKeyTransform = (val) => val,
}: SelectTypeWrapperProps<T>) => {
    if (loading) {
        return (
            <SelectType
                value="__loading__"
                onChange={() => { }}
                options={[]}
                placeholder="Loading..."
                disabled
            />
        );
    }

    if (error) {
        return (
            <SelectType
                value="__error__"
                onChange={() => { }}
                options={[]}
                placeholder="Error loading data"
                disabled
            />
        );
    }

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <SelectType
                    value={field.value || ""}
                    onChange={(val) => field.onChange(valueKeyTransform(val))}
                    options={data}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            )}
        />
    );
};

export default SelectTypeWrapper;
