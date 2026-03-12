import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { ClassNameValue } from "tailwind-merge"

interface FormInputProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  description?: string
  type?: "text" | "email" | "password" | "tel" | "url"
  autoComplete?: string
  disabled?: boolean
  required?: boolean
  className?: ClassNameValue
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
  autoComplete = "off",
  disabled = false,
  required = false,
  className,
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("w-full", className)}>
          <FieldLabel htmlFor={field.name}>
            {label}
          </FieldLabel>
          <Input
            {...field}
            id={field.name}
            type={type}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            required={required}
          />
          {description && (
            <FieldDescription>{description}</FieldDescription>
          )}
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  )
}
