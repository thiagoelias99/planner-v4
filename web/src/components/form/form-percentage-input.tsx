import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { ClassNameValue } from "tailwind-merge"

/**
 * Exemplo de validação com ZOD (numero positivo, incluindo 0.00)
 *   percentage: z.string()
     .refine((value) => {
       const num = parseFloat(value.replace(",", "."))
       return !isNaN(num) && num >= 0
     }, "O valor deve ser um número positivo.")

  * Exemplo de conversão no onSubmit (substituir , por . antes de converter para número)
      async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
          // Convert strings to numbers
          const submitData = {
            percentage: parseFloat(data.percentage.replace(",", ".")),
          }
          await createTickerOrder.mutateAsync(submitData)
          form.reset()
          toast.success("Ordem criada com sucesso!")
          if (onSuccess) {
            onSuccess(data)
          }
        } catch (error) {
          // Handle errors...
        }
      }
 */

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
  className?: ClassNameValue
}

export function FormPercentageInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  step = 0.01,
  min = 0.00,
  max = 100,
  disabled = false,
  required = false,
  className,
}: FormPercentageInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("w-full", className)}>
          <FieldLabel htmlFor={field.name}>
            {label}
          </FieldLabel>
          <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pl-2 text-muted-foreground border-l">
              %
            </span>
            <Input
              {...field}
              id={field.name}
              type="number"
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              onChange={(e) => field.onChange((e.target.value))}
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
