// src/components/form/evaluasisales/CardMember.tsx
import { CardContent, CardFieldset, CardTitleLegend } from "@/components/ui/card"
import FormInput from "@/components/FormInput"

const CardMember = () => {
    return (
        <CardFieldset className="relative border rounded-lg shadow">
            <CardTitleLegend className="text-md font-semibold mx-6 px-2">
                Member
            </CardTitleLegend>
            <CardContent className="space-y-2">
                <FormInput name="namaMember" placeholder="Nama Member" />
                <FormInput name="noMember" placeholder="Kode Member" />
                <FormInput name="kodeMonitoringMember" placeholder="Kode Monitoring Member" />
            </CardContent>
        </CardFieldset>
    )
}

export default CardMember