import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select";

interface Option {
    label: string;
    value: string;
}

interface GroupedOption {
    groupLabel: string;
    options: Option[];
}

interface SelectTypeProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (val: string) => void;
    options: (Option | GroupedOption)[];
    disabled?: boolean;
}

/**
 * Komponen SelectType mendukung:
 * - mode flat (list biasa)
 * - mode grouped (pakai groupLabel)
 */
const SelectType: React.FC<SelectTypeProps> = ({
    label,
    placeholder = "Pilih Opsi",
    value,
    onChange,
    options,
    disabled = false,
}) => {
    const isGrouped = options.some(
        (opt) => (opt as GroupedOption).groupLabel !== undefined
    );

    return (
        <div>
            {label && <label className="block mb-1 font-medium">{label}</label>}
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger className={`w-full`}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="w-full max-h-64 overflow-auto">
                    {isGrouped
                        ? (options as GroupedOption[]).map((group) => (
                            <SelectGroup key={group.groupLabel}>
                                <SelectLabel className="text-gray-700 dark:text-gray-300 font-semibold">
                                    {group.groupLabel}
                                </SelectLabel>
                                {group.options.map((opt) => (
                                    <SelectItem key={opt.value || `opt-${opt.label}`} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        ))
                        : (options as Option[]).map((opt) => (
                            <SelectItem key={opt.value || `opt-${opt.label}`} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SelectType;
