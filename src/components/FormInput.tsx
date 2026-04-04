import { Controller, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"

type FormInputProps = {
    name: string
    placeholder?: string
    onBlur?: (value: string) => void // 🔥 kirim value
    required?: boolean
    onInvalid?: () => void
}

const FormInput = ({ name, placeholder, onBlur, required, onInvalid }: FormInputProps) => {
    const { control } = useFormContext()

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <Input
                    {...field}
                    placeholder={placeholder}
                    required={required}
                    onInvalid={() => {
                        if (required) {
                            onInvalid?.(); // ✅ panggil onInvalid jika ada
                        }
                    }}
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