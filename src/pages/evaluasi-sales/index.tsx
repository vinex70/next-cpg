import Layout from "@/components/Layout"
import { FilterDetailStrukInput, FilterDetailStrukSchema } from "@/schema/filterDetailStruk"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/router";

// ⬇️ Tambahan UI dari shadcn
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Calendar22 } from "@/components/DatePicker";

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
    };

    return (
        <Layout title="Evaluasi Sales">
            <h1 className="text-2xl font-bold text-blue-500 mb-4 ">Evaluasi Sales</h1>

            <Form {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">

                    {/* ⬇️ Tambahkan Select untuk Pilih Laporan */}
                    <div>
                        <label className="block mb-1 font-medium">Pilih Jenis Laporan</label>

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


                        <Select
                            defaultValue="per-divisi"
                            onValueChange={(val: string) => methods.setValue("selectedReport", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Laporan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="per-divisi">Laporan Per Divisi</SelectItem>
                                <SelectItem value="per-departement">Laporan Per Departement</SelectItem>
                                <SelectItem value="per-kategori">Laporan Per Kategori</SelectItem>
                                <SelectItem value="per-produk">Laporan Per Produk</SelectItem>
                                {/* Tambahkan jenis laporan lainnya di sini */}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Form fields go here */}
                    <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </Form>
        </Layout>
    )
}

export default EvaluasiSales
