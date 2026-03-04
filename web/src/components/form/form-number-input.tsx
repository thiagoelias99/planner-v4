import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Controller, Control, FieldValues, Path } from "react-hook-form"

interface FormNumberInputProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  description?: string
  step?: number
  min?: number
  max?: number
  disabled?: boolean
  required?: boolean
}

export function FormNumberInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  step = 1,
  min,
  max,
  disabled = false,
  required = false,
}: FormNumberInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>
            {label}
          </FieldLabel>
          <Input
            {...field}
            id={field.name}
            type="number"
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            onChange={(e) => field.onChange(Number(e.target.value))}
            step={step}
            min={min}
            max={max}
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
