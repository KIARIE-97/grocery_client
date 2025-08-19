import { useAuth } from '@/hooks/UseAuth'
import { useUpdateUser } from '@/hooks/useUser'
import type {TEditUser } from '@/types/user.types'
import { useForm } from '@tanstack/react-form'


export const EditProfileForm = () => {
  const {user} = useAuth()
  const updateUser = useUpdateUser()
  const form = useForm({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      address: '',
    },
    onSubmit: async ({ value }) => {
      const userData: TEditUser = {
        full_name: value.full_name,
        email: value.email,
        phone_number: value.phone,
        address: value.address,
      }
      // TODO: Replace 'userId' with the actual user id from context, props, or state
      const userId = user?.id || ''
      updateUser.mutate({ id: userId, userData })
    },
  })

  return (
    <form
      className="w-full md:w-1/2 p-6 space-y-4"
      onSubmit={form.handleSubmit}
    >
      <h2 className="text-lg font-semibold">Edit Profile</h2>
      {(['full_name', 'email', 'phone', 'address'] as const).map((field) => (
        <form.Field
          key={field}
          name={field}
          children={(fieldProps) => (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {fieldProps.name}
              </label>
              <input
                name={fieldProps.name}
                value={fieldProps.state.value}
                onChange={e => fieldProps.handleChange(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
          )}
        />
      ))}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        Save Changes
      </button>
    </form>
  )
}
