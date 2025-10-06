// src/components/form/FormInput.tsx
import { Controller, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"

type FormInputProps = {
    name: string
    placeholder?: string
}

const FormInput = ({ name, placeholder }: FormInputProps) => {
    const { control } = useFormContext()

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <Input {...field} placeholder={placeholder} />
            )}
        />
    )
}

export default FormInput
