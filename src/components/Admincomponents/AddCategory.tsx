// components/AddCategoryForm.tsx
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/FormInput'
// import { Textarea } from '@/components/ui/textarea'
import { useCreateCategory } from '@/hooks/useCategory'
import { useNavigate } from '@tanstack/react-router'

export default function AddCategoryForm() {
  const { mutate: createCategory, isPending } = useCreateCategory()
  const navigate = useNavigate()


  const form = useForm({
    defaultValues: {
      name: '',
      status: 'Active',
    //   image: '',
    //   description: '',
    },
    onSubmit: async ({ value }) => {
        const data = createCategory({
          category_name: value.name,
          products: [],
      });
          console.log('Category created successfully:', data)
          navigate({ to: '/admin/category' })
      
    },
  })

  return (
    <form
      onSubmit={form.handleSubmit}
      className="space-y-4 p-6 bg-white shadow rounded"
    >
      <form.Field name="name">
        {(field) => <FormInput field={field} label="Category Name" />}
      </form.Field>

      {/* <form.Field name="status">
        {(field) => <FormInput field={field} label="Status" />}
      </form.Field> */}

      {/* <form.Field name="image">
        {(field) => (
          <div>
            <label>Category Image</label>
            <input
              type="file"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    field.handleChange(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                } else {
                  field.handleChange('');
                }
              }}
            />
          </div>
        )}
      </form.Field> */}

      {/* <form.Field name="description">
        {(field) => (
          <div>
            <label>Description</label>
            <Textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field> */}

      <Button type="submit" disabled={isPending}>
        Add New Category
      </Button>
    </form>
  )
}
