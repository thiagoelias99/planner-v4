import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Controller, Control, FieldValues, Path } from "react-hook-form"

export interface SelectOption {
  label: string
  value: string
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  description?: string
  options: SelectOption[] | readonly SelectOption[]
  orientation?: "vertical" | "horizontal" | "responsive"
  disabled?: boolean
  required?: boolean
  minWidth?: string
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Selecione",
  description,
  options,
  orientation = "vertical",
  disabled = false,
  required = false,
  minWidth = "120px",
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          orientation={orientation}
          data-invalid={fieldState.invalid}
        >
          <FieldContent>
            <FieldLabel htmlFor={field.name}>
              {label}
            </FieldLabel>
            {description && (
              <FieldDescription>{description}</FieldDescription>
            )}
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </FieldContent>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
            required={required}
          >
            <SelectTrigger
              id={field.name}
              aria-invalid={fieldState.invalid}
              className={`min-w-[${minWidth}]`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  )
}
