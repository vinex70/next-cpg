import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ReportTable } from "@/components/table/ReportTable";

import {
    FilterFormSoHarianInput,
    FilterFormSoHarianSchema,
} from "@/schema/filterFormSoHarian";

import { useReportPage } from "@/hooks/useReportPage";
import {
    formSoHarianColumns,
    FormSoHarianRows,
} from "@/configs/form-so-harian/so-harian";
import { buildReport } from "@/utils/reportBuilder";
import { formatNumber } from "@/utils/formatNumber";
import { exportToPdf } from "@/utils/exportToPdf";
import { RiFilePdf2Fill } from "react-icons/ri";

export default function FormSoHarian() {
    const router = useRouter();

    // 🔥 CONFIG TABLE (reuse system kamu)
    const config = buildReport<FormSoHarianRows>(formSoHarianColumns);
    const columns = formSoHarianColumns; // 🔥 langsung pakai config.columns jika tidak ada custom logic
    const displayColumns = columns.filter(
        (col) => col.field !== "acost" && col.field !== "flag" && col.field !== "lpp"
    );

    const {
        query,
        filteredData,
        loading,
        error,
    } = useReportPage<FormSoHarianRows>({
        basePath: "form-so-harian",
        ...config,
        enabled: !!router.query.plu, // hanya fetch jika ada query.plu
    });

    // 🔥 FORM
    const methods = useForm<FilterFormSoHarianInput>({
        resolver: zodResolver(FilterFormSoHarianSchema),
        defaultValues: {
            plu: "",
        },
    });

    // 🔥 FORMAT PLU
    const formatPluGrup = (value: string) => {
        const items = value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        const invalid = items.find((item) => !/^\d+$/.test(item));

        if (invalid) {
            throw new Error(
                `PLU tidak valid: ${invalid} (hanya angka diperbolehkan)`
            );
        }

        return items
            .map((item) => {
                let formatted = item.padStart(7, "0");
                formatted = formatted.slice(0, 6) + "0";
                return formatted;
            })
            .join(",");
    };

    // 🔥 SUBMIT → push ke URL (trigger fetch otomatis)
    const onSubmit = (formData: FilterFormSoHarianInput) => {
        try {
            const formattedPlu = formatPluGrup(formData.plu || "");

            router.push({
                pathname: "/form-so-harian",
                query: { plu: formattedPlu },
            });
        } catch (err) {
            console.error(err);
        }
    };

    // 🔥 FUNGSI RESET
    const handleReset = () => {
        // Reset form values
        methods.reset({ plu: "" });

        // Hapus query params dari URL
        router.push("/form-so-harian", undefined, { shallow: true });
    };

    return (
        <Layout title="Form SO Harian">
            <h1 className="text-2xl font-bold mb-4">
                Form SO Harian : {query.plu ? `PLU ${query.plu}` : ""}
            </h1>

            <div className="flex gap-2 mb-2">
                <Button
                    variant="outline"
                    onClick={() =>
                        exportToPdf<FormSoHarianRows>({
                            title: `Form SO Harian ${query.plu} - ${filteredData?.slice(0, 1).map((row) => row.desk)[0] ?? ""}`,
                            columns: displayColumns,
                            data: filteredData ?? [],
                            mode: "download",
                        })
                    }
                >
                    <RiFilePdf2Fill className="mr-2" /> PDF
                </Button>

                {/* 🔥 TOMBOL RESET */}
                {query.plu && (
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="bg-red-400 hover:bg-red-500 text-white shadow-2xl"
                    >
                        🔄 Reset / Clear
                    </Button>
                )}
            </div>

            {/* 🔥 FORM */}
            <Form {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="flex gap-4"
                >
                    <FormInput
                        name="plu"
                        placeholder="Contoh: 60410,79630"
                        onBlur={(value: string) => {
                            try {
                                const formatted = formatPluGrup(value);
                                methods.setValue("plu", formatted);
                            } catch (err) {
                                console.error(err);
                            }
                        }}
                    />

                    <Button type="submit" variant="outline">
                        {loading ? "Loading..." : "Submit"}
                    </Button>
                </form>

            </Form>

            {/* 🔥 ERROR */}
            {error && (
                <p className="text-red-500 mt-4">
                    {error}
                </p>
            )}

            {/* 🔥 RESULT */}
            {query.plu && !loading && (
                <div className="mt-6" id="print-area">

                    <ReportTable
                        columns={displayColumns}
                        data={filteredData ?? []}
                        customFooter={(data) => {
                            const sumPlano = data.reduce((acc, row) => acc + Number(row.plano ?? 0), 0);
                            const lpp = data.slice(0, 1).map((row) => (Number(row.lpp ?? 0)))[0] ?? 0;
                            const selisih = sumPlano - lpp;

                            const acost = data[0]?.acost ?? 0;
                            const flag = data[0]?.flag ?? "-";

                            return (
                                <>
                                    <tr className="bg-blue-400 font-semibold">
                                        <td colSpan={5} className="border px-2 py-2">
                                            Acost : {formatNumber(Number(acost))}
                                        </td>
                                        <td colSpan={3} className="border px-2 py-2 text-right">
                                            Total QTY Plano (a):
                                        </td>
                                        <td className="border px-2 py-2 text-right">
                                            {formatNumber(sumPlano)}
                                        </td>
                                    </tr>

                                    <tr className="bg-blue-400 font-semibold">
                                        <td colSpan={5} className="border px-2 py-2">
                                            Flag : {flag}
                                        </td>
                                        <td colSpan={3} className="border px-2 py-2 text-right">
                                            LPP (b):
                                        </td>
                                        <td className="border px-2 py-2 text-right">
                                            {formatNumber(lpp)}
                                        </td>
                                    </tr>

                                    <tr className="bg-blue-400 font-semibold">
                                        <td colSpan={5} className="border px-2 py-2"></td>
                                        <td colSpan={3} className="border px-2 py-2 text-right">
                                            Selisih (a-b):
                                        </td>
                                        <td className="border px-2 py-2 text-right">
                                            {formatNumber(selisih)}
                                        </td>
                                    </tr>
                                </>
                            );
                        }}
                        showRowNumber
                    />
                </div>
            )}
        </Layout>
    );
}