// components/ui/FormInput.tsx
import { FieldApi } from '@tanstack/react-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function FormInput({
  field,
  label,
}: {
  field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
  label: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.isTouched && field.state.meta.errors && (
        <p className="text-red-500 text-sm">{field.state.meta.errors}</p>
      )}
    </div>
  )
}
