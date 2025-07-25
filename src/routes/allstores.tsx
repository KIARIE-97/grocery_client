import StoreCard from '@/components/store_owner/Store'
import { createFileRoute } from '@tanstack/react-router'
import { useStores } from '@/hooks/useStore'
import { useOrders } from '@/hooks/useOrder'
import Navbar from '@/components/navbar'
import Footer from '@/components/bars/Footer'
import GroceryLoader from '@/components/ui/GroceryLoader'

export const Route = createFileRoute('/allstores')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: stores, isLoading: storesLoading } = useStores()
  const { data: orders, isLoading: ordersLoading } = useOrders()
  console.log('Stores:', stores)

  if (storesLoading || ordersLoading) return <div className='center m-50'>
    <GroceryLoader />
  </div>
  if (!stores) return <div>No stores found.</div>
  const storeArray = Array.isArray(stores) ? stores : []
  const ordersArray = Array.isArray(orders) ? orders : []

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-3 p-4">
        {storeArray.map((store) => (
          <StoreCard key={store.id} store={store} orders={ordersArray} />
        ))}
      </div>
      <Footer />
    </>
  )
}
