// CardSupplier.tsx
import { CardContent, CardFieldset, CardTitleLegend } from "@/components/ui/card";
import InputSerchSupplier from "@/components/input/InputSerchSupplier";
import InputNamaSupplier from "@/components/input/InputNamaSupplier";


const CardSupplier = () => {
    return (
        <CardFieldset className="relative border rounded-lg shadow">
            <CardTitleLegend className="text-md font-semibold mx-6 px-2">
                Supplier
            </CardTitleLegend>
            <CardContent className="space-y-2">
                <InputSerchSupplier />
                <InputNamaSupplier />
            </CardContent>
        </CardFieldset>

    );
};

export default CardSupplier;
