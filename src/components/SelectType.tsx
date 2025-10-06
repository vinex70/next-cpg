// src/components/form/SelectType.tsx
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

interface Option {
    label: string;
    value: string;
}

interface SelectTypeProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (val: string) => void;
    options: Option[];
}

const SelectType: React.FC<SelectTypeProps> = ({
    label,
    placeholder = "Pilih Opsi",
    value,
    onChange,
    options,
}) => {
    return (
        <div>
            {label && <label className="block mb-1 font-medium">{label}</label>}
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SelectType;
