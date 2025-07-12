import { UseCreateUser } from '@/hooks/useUser'
import type { TCUserData, TUserData } from '@/types/user.types'
import { useForm } from '@tanstack/react-form'


export const EditProfileForm = () => {
  const updateUser = UseCreateUser()
  const form = useForm<TCUserData>({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      address: '',
    },
    onSubmit: async ({ value }) => {
      updateUser.mutate(value)
    },
  })

  return (
    <form
      className="w-full md:w-1/2 p-6 space-y-4"
      onSubmit={form.handleSubmit}
    >
      <h2 className="text-lg font-semibold">Edit Profile</h2>
      {['full_name', 'email', 'phone', 'address'].map((field) => (
        <form.Field
          key={field}
          name={field as keyof TUserData}
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {field.name}
              </label>
              <input
                {...field.getInputProps()}
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
