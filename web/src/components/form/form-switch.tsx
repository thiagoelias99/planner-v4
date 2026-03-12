import { FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { ClassNameValue } from "tailwind-merge"

interface FormSwitchProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
  disabled?: boolean
  required?: boolean
  className?: ClassNameValue
}

export function FormSwitch<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  required = false,
  className,
}: FormSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn("w-full", className)}>
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
