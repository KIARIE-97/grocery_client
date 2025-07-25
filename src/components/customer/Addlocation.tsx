import { useCreateLocation } from '@/hooks/useLocation'
import { useForm } from '@tanstack/react-form'

interface LocationFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

type LocationFormValues = {
  label: string
  email: string
  addressLine1: string
  city: string
  state: string
  postalCode: string
  country: string
}

export const LocationForm = ({ onSuccess, onCancel }: LocationFormProps) => {
  const { mutate, isPending } = useCreateLocation()

  const form = useForm({
    defaultValues: {
      label: '',
      email: '',
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    onSubmit: async ({ value }: { value: LocationFormValues }) => {
      const locationWithId = {
        id: crypto.randomUUID(),
        ...value,
      }
      console.log('Form submitted with values:', locationWithId)
      mutate(locationWithId, {
        onSuccess: () => {
          onSuccess?.()
        },
      })
    },
  })

  return (
    <div>
      <form
        className="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        {(
          [
            'label',
            'email',
            'addressLine1',
            'city',
            'state',
            'postalCode',
            'country',
          ] as Array<keyof LocationFormValues>
        ).map((fieldName) => (
          <form.Field name={fieldName} key={fieldName}>
            {(field) => (
              <div>
                <label className="block font-medium capitalize">
                  {fieldName.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  name={field.name}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        ))}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Location'}
          </button>
        </div>
      </form>
    </div>
  )
}
