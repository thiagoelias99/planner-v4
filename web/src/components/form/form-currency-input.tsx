import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { ClassNameValue } from "tailwind-merge"

/**
 * Exemplo de validação com ZOD (numero positivo, incluindo 0.00)
 *   price: z.string()
     .refine((value) => {
       const num = parseFloat(value.replace(",", "."))
       return !isNaN(num) && num >= 0
     }, "O preço deve ser um número positivo.")

  * Exemplo de conversão no onSubmit (substituir , por . antes de converter para número)
      async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
          // Convert strings to numbers
          const submitData = {
            price: parseFloat(data.price.replace(",", ".")),
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
  className?: ClassNameValue
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
  className,
}: FormCurrencyInputProps<T>) {
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
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 text-muted-foreground border-r">
              {currency}
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
