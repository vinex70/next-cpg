import { useEffect } from "react";
import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import { FilterDetailStrukInput, FilterDetailStrukSchema } from "@/schema/filterDetailStruk";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { FormatTanggal } from "@/utils/formatTanggal";
import { Button } from "@/components/ui/button";

// ✅ Dynamic import (hindari error SSR)
const PeriodeSales = dynamic(() => import("@/components/form/evaluasisales/PeriodeSales"), { ssr: false });
const SelectReport = dynamic(() => import("@/components/form/evaluasisales/SelectReport"), { ssr: false });
const CardMember = dynamic(() => import("@/components/form/evaluasisales/CardMember"), { ssr: false });
const CardProduk = dynamic(() => import("@/components/form/evaluasisales/CardProduk"), { ssr: false });

const EvaluasiSales = () => {
    const router = useRouter();

    const methods = useForm<FilterDetailStrukInput>({
        resolver: zodResolver(FilterDetailStrukSchema),
        defaultValues: {
            selectedReport: "per-divisi",
            startDate: "",
            endDate: "",
        }
    });

    // ✅ Set tanggal di client (hindari hydration error)
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];

        methods.reset({
            selectedReport: "per-divisi",
            startDate: today,
            endDate: today,
        });
    }, [methods]);

    const onSubmit = (data: FilterDetailStrukInput) => {
        try {
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
                duration: 20000,
                position: "top-right",
                description: `Periode: ${FormatTanggal(data.startDate)} - ${FormatTanggal(data.endDate)}`,
                icon: "📊",
                closeButton: true,
            });
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Terjadi kesalahan saat submit");
        }
    };

    return (
        <Layout title="Evaluasi Sales">
            <h1 className="text-2xl font-bold text-blue-500 mb-4">
                Evaluasi Sales
            </h1>

            <Form {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="flex justify-between gap-4 flex-wrap"
                >
                    <div className="space-y-4">
                        {/* Periode */}
                        <PeriodeSales control={methods.control} />
                        {/* Member */}
                        <CardMember control={methods.control} />
                    </div>

                    {/* Produk */}
                    <CardProduk control={methods.control} />

                    {/* Select Report */}
                    <SelectReport control={methods.control} />

                    {/* Button */}
                    <div className="flex justify-end w-full">
                        <Button type="submit" variant="outline">
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </Layout>
    );
};

export default EvaluasiSales;