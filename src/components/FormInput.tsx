import { Controller, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"

type FormInputProps = {
    name: string
    placeholder?: string
    onBlur?: (value: string) => void // 🔥 kirim value
}

const FormInput = ({ name, placeholder, onBlur }: FormInputProps) => {
    const { control } = useFormContext()

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <Input
                    {...field}
                    placeholder={placeholder}
                    onBlur={(e) => {
                        field.onBlur(); // ✅ tetap panggil RHF

                        if (onBlur) {
                            onBlur(e.target.value); // ✅ kirim value ke parent
                        }
                    }}
                />
            )}
        />
    )
}

export default FormInput