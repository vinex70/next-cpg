import { Controller, Control, useWatch } from "react-hook-form";
import SelectType from "@/components/SelectType";
import { useFetchData } from "@/hooks/useFetchData";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";

interface SubOutletMember {
    sub_kodeoutlet: string;
    out_namaoutlet: string;
    sub_kodesuboutlet: string;
    sub_namasuboutlet: string;
}

type SelectSubOutletProps = {
    control: Control<FilterDetailStrukInput>;
    placeholder?: string;
};

const SelectSubOutletMember = ({
    control,
    placeholder = "All Sub-Outlet",
}: SelectSubOutletProps) => {
    const selectedOutlet = useWatch({
        control,
        name: "outlet",
    });

    const { data, error, loading } = useFetchData<SubOutletMember[]>({
        endpoint: "/select-suboutlet-member",
        queryParams: selectedOutlet ? { kodeoutlet: selectedOutlet } : undefined,
        enabled: true,
    });

    if (loading) {
        return (
            <SelectType
                value="__loading__"
                onChange={() => { }}
                options={[]}
                placeholder="Loading sub-outlet..."
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
                placeholder="Error loading sub-outlet"
                disabled
            />
        );
    }

    return (
        <Controller
            control={control}
            name="subOutlet"
            render={({ field }) => {
                if (!data || data.length === 0) {
                    return (
                        <SelectType
                            value={field.value || "__all__"}
                            onChange={(val) => field.onChange(val === "__all__" ? "" : val)}
                            placeholder="Tidak ada data sub-outlet"
                            options={[{ label: "Semua Sub-Outlet", value: "__all__" }]}
                        />
                    );
                }

                // Group data berdasarkan kode outlet
                const groupedData = data.reduce<Record<string, SubOutletMember[]>>((acc, item) => {
                    if (!acc[item.sub_kodeoutlet]) acc[item.sub_kodeoutlet] = [];
                    acc[item.sub_kodeoutlet].push(item);
                    return acc;
                }, {});

                // Siapkan data untuk SelectType
                const groupedOptions = [
                    {
                        groupLabel: "Umum",
                        options: [{ label: "All Sub-Outlet", value: "__all__" }],
                    },
                    ...Object.entries(groupedData).map(([kodeOutlet, subs]) => ({
                        groupLabel: `${kodeOutlet} - ${subs[0]?.out_namaoutlet || ""}`,
                        options: subs.map((sub) => ({
                            label: `${sub.sub_kodesuboutlet} - ${sub.sub_namasuboutlet}`,
                            value: sub.sub_kodesuboutlet,
                        })),
                    })),
                ];

                return (
                    <SelectType
                        value={field.value || "__all__"}
                        onChange={(val) => field.onChange(val === "__all__" ? "" : val)}
                        options={groupedOptions}
                        placeholder={placeholder}
                    />
                );
            }}
        />
    );
};

export default SelectSubOutletMember;
