import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Controller, Control, FieldValues, Path } from "react-hook-form"

interface FormCurrencyInputProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  description?: string
  currency?: string
  step?: number
  min?: number
  max?: number
  disabled?: boolean
  required?: boolean
}

export function FormCurrencyInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  currency = "R$",
  step = 0.01,
  min = 0.01,
  max,
  disabled = false,
  required = false,
}: FormCurrencyInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>
            {label}
          </FieldLabel>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 text-muted-foreground border-r">
              {currency}
            </span>
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
              className="pl-12"
              disabled={disabled}
              required={required}
            />
          </div>
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
