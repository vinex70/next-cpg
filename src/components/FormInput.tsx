// src/components/form/FormInput.tsx
import { Controller, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"

type FormInputProps = {
    name: string
    placeholder?: string
    onBlur?: () => void
}

const FormInput = ({ name, placeholder, onBlur }: FormInputProps) => {
    const { control } = useFormContext()

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <Input {...field} placeholder={placeholder} onBlur={onBlur} />
            )}
        />
    )
}

export default FormInput
