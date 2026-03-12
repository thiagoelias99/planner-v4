import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { ClassNameValue } from "tailwind-merge"

interface FormDateInputProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  description?: string
  mode?: "datetime" | "date" | "time" | "month"
  disabled?: boolean
  required?: boolean
  min?: Date | string
  max?: Date | string
  className?: ClassNameValue
}

export function FormDateInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  mode = "datetime",
  disabled = false,
  required = false,
  min,
  max,
  className,
}: FormDateInputProps<T>) {
  const typeMapping = {
    datetime: "datetime-local",
    date: "date",
    time: "time",
    month: "month",
  }

  const formatValue = (value: Date | string | null | undefined): string => {
    if (!value) return ""

    const date = value instanceof Date ? value : new Date(value)

    if (isNaN(date.getTime())) return ""

    switch (mode) {
      case "datetime":
        return format(date, "yyyy-MM-dd'T'HH:mm")
      case "date":
        return format(date, "yyyy-MM-dd")
      case "time":
        return format(date, "HH:mm")
      case "month":
        return format(date, "yyyy-MM")
      default:
        return ""
    }
  }

  const parseValue = (value: string): Date | null => {
    if (!value) return null

    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date
  }

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
            id={field.name}
            type={typeMapping[mode]}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            value={formatValue(field.value)}
            onChange={(e) => {
              const parsedDate = parseValue(e.target.value)
              field.onChange(parsedDate)
            }}
            onBlur={field.onBlur}
            min={min ? formatValue(min) : undefined}
            max={max ? formatValue(max) : undefined}
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
