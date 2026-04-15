import { Controller, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

type FormInputProps = {
    name: string
    placeholder?: string
    onBlur?: (value: string) => void
    required?: boolean
    onInvalid?: () => void

    // 🔥 tambahan
    iconRight?: ReactNode
    onIconClick?: () => void
}

const FormInput = ({
    name,
    placeholder,
    onBlur,
    required,
    onInvalid,
    iconRight,
    onIconClick,
}: FormInputProps) => {
    const { control } = useFormContext()

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <div className="relative">
                    <Input
                        {...field}
                        placeholder={placeholder}
                        required={required}
                        className={cn(iconRight && "pr-10")} // 🔥 kasih space kanan
                        onInvalid={() => {
                            if (required) {
                                onInvalid?.()
                            }
                        }}
                        onBlur={(e) => {
                            field.onBlur()

                            if (onBlur) {
                                onBlur(e.target.value)
                            }
                        }}
                    />

                    {iconRight && (
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black"
                            onClick={onIconClick}
                        >
                            {iconRight}
                        </div>
                    )}
                </div>
            )}
        />
    )
}

export default FormInput