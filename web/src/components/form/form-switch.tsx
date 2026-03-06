import { FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { Controller, Control, FieldValues, Path } from "react-hook-form"

interface FormSwitchProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
  disabled?: boolean
  required?: boolean
}

export function FormSwitch<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  required = false,
}: FormSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="w-full">
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FieldLabel htmlFor={field.name}>
                {label}
              </FieldLabel>
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
            </div>
            <Switch
              id={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              required={required}
              aria-invalid={fieldState.invalid}
            />
          </div>
          {fieldState.invalid && (
            <div className="mt-2">
              <FieldError errors={[fieldState.error]} />
            </div>
          )}
        </div>
      )}
    />
  )
}
