// src/components/form/evaluasisales/SelectDivisi.tsx
import { Control } from "react-hook-form";
import SelectTypeWrapper from "@/components/SelectTypeWrapper";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import { useQueryData } from "@/hooks/useQueryData";

interface Divisi {
    div_kodedivisi: string;
    div_namadivisi: string;
}

interface SelectDivisiProps {
    control: Control<FilterDetailStrukInput>;
    placeholder?: string;
}

const SelectDivisi = ({
    control,
    placeholder = "All Divisi",
}: SelectDivisiProps) => {
    const { data, error, isLoading } = useQueryData<Divisi[]>({
        endpoint: "/select-divisi",
    });

    const options =
        data && data.length > 0
            ? [
                { label: "All Divisi", value: "__ALL__" },
                ...data.map((divisi) => ({
                    label: `${divisi.div_kodedivisi} - ${divisi.div_namadivisi}`,
                    value: divisi.div_kodedivisi,
                })),
            ]
            : [{ label: "All Divisi", value: "__ALL__" }];

    return (
        <SelectTypeWrapper<FilterDetailStrukInput>
            control={control}
            name="div"
            data={options}
            loading={isLoading}
            error={!!error}
            placeholder={placeholder}
            valueKeyTransform={(val) => (val === "__ALL__" ? "" : val)}
            enableSearch
        />
    );
};

export default SelectDivisi;
