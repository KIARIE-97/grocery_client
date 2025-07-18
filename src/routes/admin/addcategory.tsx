import AddCategoryForm from '@/components/Admincomponents/AddCategory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/addcategory')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AddCategoryForm/>
  )
}
