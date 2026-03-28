// src/components/form/evaluasisales/InputPluGrup.tsx
import { useFormContext } from "react-hook-form";
import FormInput from "@/components/FormInput";

const InputPluGrup = () => {
    const { setValue, getValues } = useFormContext();

    const formatPrdcdGrup = (value: string) => {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "")
            .map((item) => {
                let formatted = item.padStart(7, "0");
                if (formatted[6] !== "0") {
                    formatted = formatted.slice(0, 6) + "0";
                }
                return formatted;
            })
            .join(",");
    };

    const handleBlur = () => {
        const currentValue = getValues("prdcd");

        const formatted = formatPrdcdGrup(currentValue || "");

        setValue("prdcd", formatted); // ✅ TANPA {}
    };

    return (
        <FormInput
            name="prdcd"
            placeholder="PLU 0060410, 79630, 5550, 850"
            onBlur={handleBlur} // ✅ trigger format saat selesai input
        />
    );
};

export default InputPluGrup;