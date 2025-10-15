import Layout from "@/components/Layout"
import { FilterDetailStrukInput, FilterDetailStrukSchema } from "@/schema/filterDetailStruk"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { FormatTanggal } from "@/utils/formatTanggal";
import { Button } from "@/components/ui/button";

import PeriodeSales from "@/components/form/evaluasisales/PeriodeSales";
import SelectReport from "@/components/form/evaluasisales/SelectReport";
import CardMember from "@/components/form/evaluasisales/CardMember";

const EvaluasiSales = () => {
    const router = useRouter();

    const methods = useForm<FilterDetailStrukInput>({
        resolver: zodResolver(FilterDetailStrukSchema),
        defaultValues: {
            selectedReport: "per-divisi",
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
        }
    });

    const onSubmit = (data: FilterDetailStrukInput) => {
        const reportType = data.selectedReport || "per-divisi";
        const params = new URLSearchParams();

        Object.entries(data).forEach(([key, value]) => {
            if (value) {
                if (Array.isArray(value)) {
                    value.forEach((v) => params.append(key, v));
                } else {
                    params.append(key, value.toString());
                }
            }
        });

        router.push(`/evaluasi-sales/laporan/${reportType}?${params.toString()}`);
        toast.success(`Laporan ${reportType} sedang di proses`, {
            duration: 2000,
            position: "top-right",
            description: `Periode: ${FormatTanggal(data.startDate)} - ${FormatTanggal(data.endDate)}`,
            icon: "📊",
            closeButton: true,
        });
    };

    return (
        <Layout title="Evaluasi Sales">
            <h1 className="text-2xl font-bold text-blue-500 mb-4">Evaluasi Sales</h1>

            <Form {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="flex justify-between gap-4 flex-wrap">
                    {/* Komponen Periode */}
                    <PeriodeSales control={methods.control} />
                    {/* Komponen Member */}
                    <CardMember control={methods.control} />
                    {/* Komponen Select Report */}
                    <SelectReport control={methods.control} />

                    <div className="flex justify-end">
                        <Button type="submit" variant="outline">Submit</Button>
                    </div>
                </form>
            </Form>
        </Layout>
    )
}

export default EvaluasiSales
