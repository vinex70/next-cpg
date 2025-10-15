// CardProduk.tsx
import { CardContent, CardFieldset, CardTitleLegend } from "@/components/ui/card";
import FormInput from "@/components/FormInput";
import { Control } from "react-hook-form";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import SelectDivisi from "./SelectDivisi";

type CardProdukProps = {
    control: Control<FilterDetailStrukInput>;
};

const CardProduk = ({ control }: CardProdukProps) => {
    return (
        <CardFieldset className="relative border rounded-lg shadow">
            <CardTitleLegend className="text-md font-semibold mx-6 px-2">
                Produk
            </CardTitleLegend>
            <CardContent className="space-y-2">
                <FormInput name="namaBarang" placeholder="Nama Barang" />
                <FormInput name="prdprdcd" placeholder="PLU" />
                <FormInput name="barcode" placeholder="Barcode" />
                <FormInput name="monitoringPlu" placeholder="Kode Monitoring PLU" />
                <SelectDivisi control={control} />
            </CardContent>
        </CardFieldset>
    );
};

export default CardProduk;
