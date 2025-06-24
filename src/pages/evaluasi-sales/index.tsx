import Layout from "@/components/Layout"
import { FilterDetailStrukInput, FilterDetailStrukSchema } from "@/schema/filterDetailStruk"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/router";

// ⬇️ Tambahan UI dari shadcn
import { Calendar22 } from "@/components/DatePicker";
import { toast } from "sonner";
import { FormatTanggal } from "@/utils/formatTanggal";
import SelectReportType from "@/components/form/evaluasisales/SelectReportType";
import { Button } from "@/components/ui/button";

const EvaluasiSales = () => {
    const router = useRouter();

    const methods = useForm<FilterDetailStrukInput>({
        resolver: zodResolver(FilterDetailStrukSchema),
        defaultValues: {
            selectedReport: "per-divisi",
            startDate: new Date().toISOString().split("T")[0], // today
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
            duration: 3000,
            position: "top-right",
            description: `Periode: ${FormatTanggal(data.startDate)} - ${FormatTanggal(data.endDate)}`,
            icon: "📊",
            closeButton: true,

        });
    };

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
        { label: "Laporan Per Supplier", value: "per-supplier" }
    ];

    return (
        <Layout title="Evaluasi Sales">
            <h1 className="text-2xl font-bold text-blue-500 mb-4 ">Evaluasi Sales</h1>

            <Form {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">

                    {/* ⬇️ Tambahkan Select untuk Pilih Laporan */}
                    <div>
                        <label className="block mb-1 font-medium">Pilih Jenis Laporan</label>
                        { /* Controller untuk startDate */}
                        <Controller
                            control={methods.control}
                            name="startDate"
                            render={({ field }) => (
                                <Calendar22
                                    label="Tanggal Mulai"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        { /* Controller untuk endDate */}
                        <Controller
                            control={methods.control}
                            name="endDate"
                            render={({ field }) => (
                                <Calendar22
                                    label="Tanggal Akhir"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {/* Controller untuk Select Report Type */}
                        <Controller
                            control={methods.control}
                            name="selectedReport"
                            render={({ field }) => (
                                <SelectReportType
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    options={reportOptions}
                                />
                            )}
                        />
                    </div>

                    {/* Form fields go here */}
                    <div className="flex justify-end">
                        <Button type="submit" variant={"outline"}>Submit</Button>
                    </div>
                </form>
            </Form>
        </Layout>
    )
}

export default EvaluasiSales
