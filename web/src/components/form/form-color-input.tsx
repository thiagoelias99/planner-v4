import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { ClassNameValue } from "tailwind-merge"

/**
 * Validação:
 * const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/

color: z.string().refine(value => hexColorRegex.test(value), {
  message: "A cor deve estar no formato hexadecimal válido (#RRGGBB ou #RRGGBBAA)"
}),
 */

interface FormColorInputProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  description?: string
  disabled?: boolean
  required?: boolean
  className?: ClassNameValue
}

export function FormColorInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "#000000",
  description,
  disabled = false,
  required = false,
  className,
}: FormColorInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("w-full", className)}>
          <FieldLabel htmlFor={field.name}>
            {label}
          </FieldLabel>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                {...field}
                id={field.name}
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                maxLength={7}
                className="font-mono"
              />
            </div>
            <Input
              type="color"
              value={field.value || "#000000"}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={disabled}
              className="w-16 h-10 cursor-pointer"
              aria-label={`Seletor de cor para ${label}`}
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
