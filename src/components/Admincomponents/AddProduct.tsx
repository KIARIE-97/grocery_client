import { useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Upload, X, Loader2, CheckCircle } from 'lucide-react'
import { useCreateProduct } from '@/hooks/UseProduct'
import type { TProductForm } from '@/types/product.types'
import { useCategories } from '@/hooks/useCategory'

export default function ProductUploadPage() {
  const navigate = useNavigate()
  const createProductMutation = useCreateProduct()
  const { data: categories, isLoading: loadingCategories } = useCategories()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')

  // Cloudinary config
  const CLOUDINARY_CLOUD_NAME =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dfzzeclhz'
  const CLOUDINARY_UPLOAD_PRESET =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'grocerjet'

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('folder', 'freshcart/products')

    setUploadProgress(10)
    setIsUploading(true)
    setUploadError('')

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData },
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
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload image',
      )
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageChange = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, or WebP)')
      return
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB')
      return
    }
    setUploadError('')
    setPreviewImage(null)
    setUploadProgress(0)
    try {
      // For preview, read file as data URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file)
      form.setFieldValue('product_image', cloudinaryUrl)
    } catch (error) {
      // Error already handled in uploadToCloudinary
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageChange(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageChange(file)
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
    form.setFieldValue('product_image', '')
    setUploadError('')
    setUploadProgress(0)
  }

  const form = useForm<
    TProductForm,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >({
    defaultValues: {
      product_name: '',
      product_description: '',
      product_price: 0,
      quantity: 0,
      stock: 0,
      size: '',
      is_available: true,
      product_image: '',
      category_id: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const categoryId = parseInt(value.category_id)
        if (isNaN(categoryId)) {
          throw new Error('Invalid category selected')
        }

        const payload = {
          ...value,
          categories: [categoryId], // ✅ convert to array of number
        }
        delete (payload as any).category_id

        createProductMutation.mutate(payload)
        navigate({ to: '/admin/product' })
      } catch (error) {
        console.error('Submission error:', error)
      }
    },
  })

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-6"
      >
        {/* Product Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              disabled={isUploading}
            />

            {previewImage || form.state.values.product_image ? (
              <div className="relative">
                <img
                  src={
                    typeof form.state.values.product_image === 'string' &&
                    form.state.values.product_image.includes('cloudinary')
                      ? form.state.values.product_image
                      : previewImage || ''
                  }
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-md"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage()
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
                {/* Upload Success */}
                {!isUploading &&
                  typeof form.state.values.product_image === 'string' &&
                  form.state.values.product_image.includes('cloudinary') && (
                    <div className="mt-2 flex items-center text-green-600 text-xs justify-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Image uploaded successfully
                    </div>
                  )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-xs text-gray-400">Max size: 5MB</p>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Uploading...</span>
                  <span className="text-xs text-gray-600">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            {/* Upload Error */}
            {uploadError && (
              <div className="mt-2 flex items-center text-red-600 text-xs justify-center">
                {uploadError}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPEG, PNG, WebP (max 5MB)
          </p>
        </div>
        {/* Product Name */}
        <div className="space-y-2">
          <form.Field
            name="product_name"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Product name is required' : undefined,
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 "
                >
                  Product Name
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full h-15 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
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

        {/* Product Description */}
        <div className="space-y-2">
          <form.Field
            name="product_description"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Product description is required' : undefined,
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Description
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  rows={3}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 md:text-md ${
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
        {/* category  */}
        <div className="space-y-2">
          <form.Field
            name="category_id"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Category is required' : undefined,
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    field.state.meta.errors ? 'border-red-500' : 'border'
                  }`}
                >
                  <option value="" disabled>
                    {loadingCategories
                      ? 'Loading categories...'
                      : 'Select a category'}
                  </option>
                  {(Array.isArray(categories) ? categories : []).map(
                    (category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.category_name}
                      </option>
                    ),
                  )}
                </select>
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Price and Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <form.Field
              name="product_price"
              validators={{
                onChange: ({ value }) =>
                  value <= 0 ? 'Price must be greater than 0' : undefined,
              }}
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">KES</span>
                    </div>
                    <input
                      type="number"
                      id={field.name}
                      name={field.name}
                      min="0"
                      step="10.00"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(parseFloat(e.target.value))
                      }
                      className={`block w-full h-10 rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        field.state.meta.errors ? 'border-red-500' : 'border'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {field.state.meta.errors && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </>
              )}
            />
          </div>
{/* name */}
          <div className="space-y-2">
            <form.Field
              name="quantity"
              validators={{
                onChange: ({ value }) =>
                  value < 0 ? 'Quantity cannot be negative' : undefined,
              }}
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    min="0"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(parseInt(e.target.value))
                    }
                    className={`mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
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
        </div>

        {/* Stock and Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <form.Field
              name="stock"
              validators={{
                onChange: ({ value }) =>
                  value < 0 ? 'Stock cannot be negative' : undefined,
              }}
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    min="0"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(parseInt(e.target.value))
                    }
                    className={`mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
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

          <div className="space-y-2">
            <form.Field
              name="size"
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Size
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
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
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <form.Field
            name="is_available"
            children={(field) => (
              <div className="flex items-center">
                <input
                  id={field.name}
                  name={field.name}
                  type="checkbox"
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor={field.name}
                  className="ml-2 block text-sm text-gray-700"
                >
                  Available for purchase
                </label>
              </div>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={createProductMutation.isPending}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createProductMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : createProductMutation.isSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Product Saved!
              </>
            ) : (
              'Save Product'
            )}
          </button>

          {createProductMutation.isError && (
            <p className="mt-2 text-sm text-red-500">
              Error: {createProductMutation.error.message}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
