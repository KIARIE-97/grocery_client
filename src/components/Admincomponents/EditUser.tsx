import { useForm } from '@tanstack/react-form'
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  User,
  Mail,
  Phone,
} from 'lucide-react'
import { useUpdateUser } from '@/hooks/useUser'
import type { TEditUser } from '@/types/user.types'
import { toast } from 'sonner'
import React from 'react'
import { useAuth } from '@/hooks/UseAuth'

export default function EditUserForm({
  initialData,
  onSuccess,
}: {
  initialData: TEditUser
  onSuccess?: () => void
}) {
  const { user, setUser } = useAuth()
  const updateUserMutation = useUpdateUser()
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState('')
  const [uploadProgress, setUploadProgress] = React.useState(0)
  // const {user} = useAuth()
  

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dfzzeclhz'
  const CLOUDINARY_UPLOAD_PRESET =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'grocerjet'

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('folder', 'freshcart/profiles')

    try {
      setUploadProgress(10)
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      )

      setUploadProgress(80)

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errorMessage =
          errorData?.error?.message || `Upload failed: ${response.statusText}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setUploadProgress(100)
      return data.secure_url
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw new Error(
        error instanceof Error ? error.message : 'Failed to upload image',
      )
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, or WebP)')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    setUploadError('')
    setUploadProgress(0)

    try {
      const cloudinaryUrl = await uploadToCloudinary(file)
      form.setFieldValue('profile_url', cloudinaryUrl)
      setUploadProgress(100)
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload image',
      )
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const form = useForm({
    defaultValues: {
      full_name: initialData.full_name || '',
      email: initialData.email || '',
      phone_number: initialData.phone_number || '',
      profile_url: initialData.profile_url || '',
    },
    onSubmit: async ({ value }) => {
      try {
const userId = initialData.userId ?? user?.id;
if (!userId) {
  throw new Error('User ID is required to update the user.');
}
const updatedUser = await updateUserMutation.mutateAsync({
  id: userId,
  userData: value,
});
setUser?.(updatedUser);

toast.success('Profile updated successfully')
onSuccess?.()
      } catch (error) {
        console.error('Error updating user:', error)
        toast.error('Failed to update user')
      }
    },
  })

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <User className="w-5 h-5" />
        Edit Profile
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* Full Name */}
        <div className="space-y-2">
          <form.Field
            name="full_name"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Full name is required' : undefined,
            }}
            children={(field) => (
              <div className="space-y-1">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 flex items-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    field.state.meta.errors ? 'border-red-500' : 'border'
                  } p-2`}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Email is required' : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                if (!value.includes('@')) {
                  return 'Please enter a valid email'
                }
                return undefined
              },
            }}
            children={(field) => (
              <div className="space-y-1">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700  items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    field.state.meta.errors ? 'border-red-500' : 'border'
                  } p-2`}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <form.Field
            name="phone_number"
            children={(field) => (
              <div className="space-y-1">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700  items-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    field.state.meta.errors ? 'border-red-500' : 'border'
                  } p-2`}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Profile Image */}
        <div className="space-y-2">
          <form.Field
            name="profile_url"
            children={(field) => (
              <div className="space-y-1">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  {field.state.value && (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                      <img
                        src={field.state.value}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                        field.state.meta.errors ? 'border-red-500' : 'border'
                      }`}
                    />
                    {isUploading && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {uploadError && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {uploadError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={updateUserMutation.isPending || isUploading}
            className="inline-flex items-center justify-center w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updateUserMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
