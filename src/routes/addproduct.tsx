import ProductUploadPage from '@/components/Admincomponents/AddProduct'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/addproduct')({
  component: ProductUploadPage,
})


