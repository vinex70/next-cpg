import { Input } from "@/components/ui/input";
import { TfiSearch } from "react-icons/tfi";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = "Cari...",
    className = "",
}) => {
    return (
        <div className="relative w-full max-w-sm">
            <TfiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-sm" />
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`pl-10 border py-2 rounded-md text-sm ${className}`}
            />
        </div>
    );
};

export default SearchInput;
