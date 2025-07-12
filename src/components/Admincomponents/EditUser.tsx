import { useForm } from '@tanstack/react-form'
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { useUpdateUser } from '@/hooks/useUser'
import type { TEditUser } from '@/types/user.types'
import { toast } from 'sonner'
import React, { useState } from 'react'

export default function EditUserForm({
  initialData,
}: {
  initialData: TEditUser
}) {
  const updateUserMutation = useUpdateUser()
  const [error, setError] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState('')
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [myform, setmyForm] = useState({
      full_name:  '',
      email: '',
      phone_number: '',
      profile_url: '',
      // address: initialData.address || '',
    
  })

  
  // Cloudinary configuration - replace with your actual values
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dfzzeclhz';
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'grocerjet';

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Add folder for organization
    formData.append('folder', 'freshcart/products');

    try {
      setUploadProgress(10);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      console.log('response', response)

      setUploadProgress(80);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error?.message || `Upload failed: ${response.statusText}`;

        // Special handling for upload preset errors
        if (errorMessage.includes('upload preset') || errorMessage.includes('preset')) {
          throw new Error('Upload preset not found. Please check your Cloudinary configuration or create an unsigned upload preset.');
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUploadProgress(100);

      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to upload image');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadProgress(0);

    try {
      // For immediate preview, read file as data URL
      // const reader = new FileReader();
      // reader.onload = () => {
      //   setmyForm((prev: TEditUser) => ({
      //     ...prev,
      //     profile_url: reader.result as string,
      //   }))
      // };
      // reader.readAsDataURL(file);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file);

      // Update form with Cloudinary URL
      // setmyForm((prev: TEditUser) => ({ ...prev, profile_url: cloudinaryUrl }))
      form.setFieldValue('profile_url', cloudinaryUrl)

      setUploadProgress(100);

    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const form = useForm<TEditUser, any, any, any, any, any, any, any, any, any>({
    defaultValues: {
      full_name: initialData.full_name || '',
      email: initialData.email || '',
      phone_number: initialData.phone_number || '',
      profile_url: initialData.profile_url || '',
      // address: initialData.address || '',
    },
    onSubmit: async ({ value }) => {
      try {
        updateUserMutation.mutate({ id: '25', userData: value })
      } catch (error) {
        console.error('Error updating user:', error)
        toast.error('Failed to update user')}
    },
  })

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-6"
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
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    field.state.meta.errors ? 'border-red-500' : 'border'
                  }`}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
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
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    field.state.meta.errors ? 'border-red-500' : 'border'
                  }`}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <form.Field
            name="phone_number"
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    field.state.meta.errors ? 'border-red-500' : 'border'
                  }`}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Address */}
        {/* <div className="space-y-2">
          <form.Field
            name="address"
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    field.state.meta.errors ? 'border-red-500' : 'border'
                  }`}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
            )}
          />
        </div> */}

        {/* Profile URL */}
        <div className="space-y-2">
        <form.Field
          name="profile_url"
        >
          {(field) => (
            <>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                Profile URL
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={isUploading}
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
                className={`mt-1 block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  field.state.meta.errors ? 'border-red-500' : 'border'
                }`}
              />
              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Uploading...</span>
                    <span className="text-xs text-gray-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#00A7B3] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {/* Upload Success */}
              {!isUploading && field.state.value && typeof field.state.value === 'string' && field.state.value.includes('cloudinary') && (
                <div className="mt-2 flex items-center text-green-600 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Image uploaded successfully
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPEG, PNG, WebP (max 5MB)
              </p>
              {/* Upload Error */}
              {uploadError && (
                <div className="mt-2 flex items-center text-red-600 text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {uploadError}
                </div>
              )}
              {field.state.meta.errors && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </>
          )}
        </form.Field>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={updateUserMutation.isPending}
            className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateUserMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : updateUserMutation.isSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                User Updated!
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          {updateUserMutation.isError && (
            <p className="mt-2 text-sm text-red-500">
              Error: {updateUserMutation.error.message}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
