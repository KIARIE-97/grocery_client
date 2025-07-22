import { useCreateLocation } from '@/hooks/useLocation'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

const locationSchema = z.object({
  ownerType: z.enum(['customer', 'driver', 'store_owner']),
  label: z.string().min(1),
  email: z.string().email(),
  addressLine1: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
})

type OwnerType = 'customer' | 'driver' | 'store_owner'

type LocationFormValues = {
  // ownerType: OwnerType
  label: string
  email: string
  addressLine1: string
  city: string
  state: string
  postalCode: string
  country: string
}

export const LocationForm = () => {
  const { mutate, isPending } = useCreateLocation()

  const form = useForm({
    defaultValues: {
      // ownerType: 'customer',
      label: '',
      email: '',
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    onSubmit: async ({ value }: { value: LocationFormValues }) => {
      console.log('Form submitted with values:', value),
      mutate(value)
    },
  })

  return (
    <form
      className="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      {/* <form.Field
        name="ownerType"
        validators={{
          onChange: ({ value }) =>
            !value ? 'ownerType name is required' : undefined,
        }}
      >
        {(field) => (
          <div>
            <label className="block font-medium">Owner Type</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(() => e.target.value as any)}
              name={field.name}
            >
              <option value="customer">Customer</option>
              <option value="driver">Driver</option>
              <option value="store_owner">Store Owner</option>
            </select>
            {field.state.meta.errors && (
              <p className="text-sm text-red-500">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )} */}
      {/* </form.Field> */}

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
                {fieldName}
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

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={isPending}
      >
        {isPending ? 'Saving...' : 'Save Location'}
      </button>
    </form>
  )
}
