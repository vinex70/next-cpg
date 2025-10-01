import { CardContent, CardFieldset, CardTitleLegend } from "@/components/ui/card"
import { Controller, Control } from "react-hook-form"
import { Calendar22 } from "@/components/DatePicker"
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk"

type PeriodeSalesProps = {
    control: Control<FilterDetailStrukInput>
}

const PeriodeSales = ({ control }: PeriodeSalesProps) => {
    return (
        <CardFieldset className="relative border rounded-lg shadow">
            <CardTitleLegend className="text-md font-semibold mx-6 px-2">Periode</CardTitleLegend>
            <CardContent>
                {/* Tanggal Mulai */}
                <Controller
                    control={control}
                    name="startDate"
                    render={({ field }) => (
                        <Calendar22
                            label="Tanggal Mulai"
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />

                {/* Tanggal Akhir */}
                <Controller
                    control={control}
                    name="endDate"
                    render={({ field }) => (
                        <Calendar22
                            label="Tanggal Akhir"
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            </CardContent>
        </CardFieldset>
    )
}

export default PeriodeSales
