import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format, setHours } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { ClassNameValue } from "tailwind-merge"
import { Button } from "../ui/button"
import { ptBR } from "date-fns/locale"

interface FormDateProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
  disabled?: boolean
  dateFormatter?: string
  className?: ClassNameValue
}

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  dateFormatter = "dd/MM/yyyy",
  className,
}: FormDateProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("w-full", className)}>
          <FieldLabel htmlFor={field.name}>
            {label}
          </FieldLabel>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker-simple"
                className="justify-start font-normal"
              >
                {field.value ? format(new Date(field.value), dateFormatter, { locale: ptBR }) : <span>Selecione um data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date ? setHours(date, 12).toISOString() : null)}
                defaultMonth={field.value ? new Date(field.value) : undefined}
                disabled={disabled}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
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
