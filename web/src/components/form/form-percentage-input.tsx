import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Controller, Control, FieldValues, Path } from "react-hook-form"

interface FormPercentageInputProps<T extends FieldValues> {
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

export function FormPercentageInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  step = 0.01,
  min = 0.01,
  max = 100,
  disabled = false,
  required = false,
}: FormPercentageInputProps<T>) {
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
            <span className="absolute inset-y-0 right-0 flex items-center pr-10 pl-2 text-muted-foreground border-l">
              %
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
