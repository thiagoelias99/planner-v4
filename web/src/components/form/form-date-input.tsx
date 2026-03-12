import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { format, setHours } from "date-fns"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { ClassNameValue } from "tailwind-merge"

interface FormDateInputProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
  className?: ClassNameValue
}

export function FormDateInput<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
}: FormDateInputProps<T>) {
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
            type="date"
            aria-invalid={fieldState.invalid}
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
