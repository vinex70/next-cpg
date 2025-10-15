// src/components/form/evaluasisales/SelectSubOutletMember.tsx
import { Control, useWatch } from "react-hook-form";
import SelectTypeWrapper from "@/components/SelectTypeWrapper";
import { useFetchData } from "@/hooks/useFetchData";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";

interface SubOutletMember {
    sub_kodeoutlet: string;
    out_namaoutlet: string;
    sub_kodesuboutlet: string;
    sub_namasuboutlet: string;
}

interface SelectSubOutletProps {
    control: Control<FilterDetailStrukInput>;
    placeholder?: string;
}

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
        queryParams: selectedOutlet != null ? { kodeoutlet: selectedOutlet } : undefined,
        enabled: true,
    });

    // Default grup "Umum" selalu ada
    let groupedOptions = [
        {
            groupLabel: "Umum",
            options: [{ label: "All Sub-Outlet", value: "__all__" }],
        },
    ];

    // Jika data ada → tambahkan grouped options
    if (data && data.length > 0) {
        const groupedData = data.reduce<Record<string, SubOutletMember[]>>((acc, item) => {
            if (!acc[item.sub_kodeoutlet]) acc[item.sub_kodeoutlet] = [];
            acc[item.sub_kodeoutlet].push(item);
            return acc;
        }, {});

        groupedOptions = [
            ...groupedOptions,
            ...Object.entries(groupedData).map(([kodeOutlet, subs]) => ({
                groupLabel: `${kodeOutlet} - ${subs[0]?.out_namaoutlet ?? ""}`,
                options: subs.map((sub) => ({
                    label: `${sub.sub_kodesuboutlet} - ${sub.sub_namasuboutlet}`,
                    value: sub.sub_kodesuboutlet,
                })),
            })),
        ];
    }

    return (
        <SelectTypeWrapper<FilterDetailStrukInput>
            control={control}
            name="subOutlet"
            data={groupedOptions}
            loading={loading}
            error={!!error}
            placeholder={placeholder}
            valueKeyTransform={(val) => (val === "__all__" ? "" : val)}
        />
    );
};

export default SelectSubOutletMember;
