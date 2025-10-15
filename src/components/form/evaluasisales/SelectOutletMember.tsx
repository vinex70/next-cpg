// src/components/form/evaluasisales/SelectOutletMember.tsx
import { Controller, Control } from "react-hook-form";
import SelectType from "@/components/SelectType";
import { useFetchData } from "@/hooks/useFetchData";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";

interface OutletMember {
    out_kodeoutlet: string;
    out_namaoutlet: string;
}

type SelectOutletProps = {
    control: Control<FilterDetailStrukInput>;
    placeholder?: string;
};

const SelectOutletMember = ({
    control,
    placeholder = "All Outlet",
}: SelectOutletProps) => {
    const { data, error, loading } = useFetchData<OutletMember[]>({
        endpoint: "/select-outlet-member",
    });

    if (loading) {
        return (
            <div className="w-full p-2 text-sm text-gray-500 italic border rounded-md bg-gray-50">
                Memuat daftar outlet...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-2 text-sm text-red-600 border border-red-300 rounded-md bg-red-50">
                Gagal memuat outlet: {error}
            </div>
        );
    }

    return (
        <Controller
            control={control}
            name="outlet"
            render={({ field }) => {
                const options =
                    data && data.length > 0
                        ? [
                            { label: "All Outlet", value: "__ALL__" }, // ✅ gunakan value non-empty
                            ...data.map((outlet) => ({
                                label: `${outlet.out_kodeoutlet} - ${outlet.out_namaoutlet}`,
                                value: outlet.out_kodeoutlet,
                            })),
                        ]
                        : [{ label: "Semua Outlet", value: "__ALL__" }];

                return (
                    <SelectType
                        value={field.value || ""}
                        onChange={(val) =>
                            field.onChange(val === "__ALL__" ? "" : val)
                        } // ubah "__ALL__" → "" agar form tetap kosong
                        options={options}
                        placeholder={placeholder}
                    />
                );
            }}
        />
    );
};

export default SelectOutletMember;
