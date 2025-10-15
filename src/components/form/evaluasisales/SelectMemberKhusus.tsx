import { Controller, Control } from "react-hook-form";
import SelectType from "@/components/SelectType";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";

type SelectMemberKhususProps = {
    control: Control<FilterDetailStrukInput>;
    placeholder?: string;
};

const SelectMemberKhusus = ({
    control,
    placeholder = "All Member",
}: SelectMemberKhususProps) => {
    const memberOptions = [
        { label: "All Member", value: "__all__" }, // ✅ Tambahkan opsi 'semua'
        { label: "Member Biru", value: "N" },
        { label: "Member Merah", value: "Y" },
    ];

    return (
        <Controller
            control={control}
            name="memberKhusus"
            render={({ field }) => (
                <SelectType
                    value={field.value || "__all__"} // ✅ tampilkan "__all__" jika kosong
                    onChange={(val) => field.onChange(val === "__all__" ? "" : val)} // ✅ ubah "__all__" jadi ""
                    options={memberOptions}
                    placeholder={placeholder}
                />
            )}
        />
    );
};

export default SelectMemberKhusus;
