import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DollarSign,
  Package,
  ShoppingCart,
  XCircle,
} from 'lucide-react';
import Orders from '@/components/Admincomponents/Orders';
import IncomeSummary from '@/components/Admincomponents/Summary';
import { useAuth } from '@/hooks/UseAuth';
import { useOrders } from '@/hooks/useOrder';
import Error from '@/components/error';
import GroceryLoader from '@/components/ui/GroceryLoader';

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated } = useAuth()
    const { data: orders, error, isLoading } = useOrders()
    const totalIncome = Array.isArray(orders)
      ? orders.reduce(
          (acc, order) =>
            acc +
            (Number(order.total_amount) || 0) -
            (Number(order.tax_amount) || 0),
          0,
        )
      : 0
  
    if (error) return <Error error={error} />
    if (isLoading) return (
      <div className="center m-50">
        <GroceryLoader />
      </div>
    )
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
    {/* <Navbar/> */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Order Pending
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              {isAuthenticated && (
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Array.isArray(orders)
                      ? orders.filter((order) => order.status === 'pending')
                          .length
                      : 0}
                  </div>
                </CardContent>
              )}
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Order Cancel
                </CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              {isAuthenticated && (
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Array.isArray(orders)
                      ? orders.filter((order) => order.status === 'cancelled')
                          .length
                      : 0}
                  </div>
                </CardContent>
              )}
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Order Process
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              {isAuthenticated && (
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Array.isArray(orders)
                      ? orders.filter(
                          (order) => order.status === 'out_for_delivery',
                        ).length
                      : 0}
                  </div>
                </CardContent>
              )}
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today Income
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Ksh.{totalIncome.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-1">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>2023 Income & Order Summary</CardTitle>
                <CardDescription>
                  An overview of your income and order trends.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <IncomeSummary />
              </CardContent>
            </Card>
            <Orders />
          </div>
        </main>
      </div>
    </div>
  )
}
