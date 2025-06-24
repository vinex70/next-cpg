import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

interface ReportOption {
    label: string;
    value: string;
}

interface SelectReportTypeProps {
    value: string;
    onChange: (val: string) => void;
    options: ReportOption[];
}

const SelectReportType: React.FC<SelectReportTypeProps> = ({ value, onChange, options }) => {
    return (
        <div>
            <label className="block mb-1 font-medium">Pilih Jenis Laporan</label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Pilih Laporan" />
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

export default SelectReportType;
