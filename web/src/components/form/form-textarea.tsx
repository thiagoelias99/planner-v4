import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { ClassNameValue } from "tailwind-merge"

interface FormTextareaProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  description?: string
  minHeight?: string
  disabled?: boolean
  required?: boolean
  className?: ClassNameValue
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  minHeight = "120px",
  disabled = false,
  required = false,
  className,
}: FormTextareaProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("w-full", className)}>
          <FieldLabel htmlFor={field.name}>
            {label}
          </FieldLabel>
          <Textarea
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            className={`min-h-[${minHeight}]`}
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
