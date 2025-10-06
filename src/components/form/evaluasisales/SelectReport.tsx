// src/components/form/evaluasisales/SelectReport.tsx
import { Controller, Control } from "react-hook-form"
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk"
import SelectReportType from "@/components/SelectType"

type SelectReportProps = {
    control: Control<FilterDetailStrukInput>
}

const SelectReport = ({ control }: SelectReportProps) => {
    const reportOptions = [
        { label: "Laporan Per Divisi", value: "per-divisi" },
        { label: "Laporan Per Departement", value: "per-departement" },
        { label: "Laporan Per Kategori", value: "per-kategori" },
        { label: "Laporan Per Produk", value: "per-produk" },
        { label: "Laporan Per Produk Tanggal", value: "per-produk-tanggal" },
        { label: "Laporan Per Tanggal", value: "per-tanggal" },
        { label: "Laporan Per Struk", value: "per-struk" },
        { label: "Laporan Per Kasir", value: "per-kasir" },
        { label: "Laporan Per Member", value: "per-member" },
        { label: "Laporan Per Group Member", value: "per-group-member" },
        { label: "Laporan Per Supplier", value: "per-supplier" },
        { label: "Laporan Per Bulan", value: "per-bulan" },
    ]

    return (
        <Controller
            control={control}
            name="selectedReport"
            render={({ field }) => (
                <SelectReportType
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={reportOptions}
                />
            )}
        />
    )
}

export default SelectReport
