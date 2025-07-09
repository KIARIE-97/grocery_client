import AddCategoryForm from '@/components/Admincomponents/AddCategory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/addcategory')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AddCategoryForm/>
  )
}
