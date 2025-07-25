import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
} from 'recharts'
import {
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Layers,
  Users,
} from 'lucide-react'
import { useOrders } from '@/hooks/useOrder'
import type { TProduct } from '@/types/product.types'
import { useAuth } from '@/hooks/UseAuth'
import { useCategories } from '@/hooks/useCategory'
import GroceryLoader from '../ui/GroceryLoader'

const Dashboard: React.FC = () => {
  const { data: ordersRaw, isLoading } = useOrders()
  const orders = Array.isArray(ordersRaw) ? ordersRaw : []
  const { user } = useAuth()
  const {data: categories} = useCategories()

  // Aggregate/calculated values
  const totalSales = orders?.length || 0
  const totalRevenue =
    orders?.reduce((acc, order) => acc + order.total_amount, 0) || 0
  const totalCost =
    orders?.reduce(
      (acc, order) =>
        acc +
        order.products.reduce(
          (a: number, p: TProduct) => a + (p.product_price || 0) * (p.quantity || 0),
          0,
        ),
      0,
    ) || 0
  const profit = totalRevenue - totalCost

  // Inventory (for illustration; replace with your stock/inventory hook)
  const allProducts = orders?.flatMap((o) => o.products) || []
  const productStockMap = new Map<number, { product: TProduct; sold: number }>()
  allProducts.forEach((p) => {
    if (!productStockMap.has(p.id)) {
      productStockMap.set(p.id, { product: p, sold: p.quantity || 0 })
    } else {
      productStockMap.get(p.id)!.sold += p.quantity || 0
    }
  })
  const topSelling = [...productStockMap.values()]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 3)
  const lowQuantity = [...productStockMap.values()].filter(
    ({ product }) => product.stock < 5,
  )

  // Fake summary values; replace these with real queries/hooks:
  const inventorySummary = { quantityInHand: 868, toBeReceived: 200 }
  const purchaseOverview = {
    count: 82,
    cost: 13573,
    cancelled: 5,
    returned: 17432,
  }
  const productSummary = { suppliers: 31, categories: Array.isArray(categories) ? categories.length : 0 }

  // Example data for charts
  const salesPurchaseData = [
    { name: 'Jan', Purchase: 50000, Sales: 40000 },
    { name: 'Feb', Purchase: 52000, Sales: 41000 },
    { name: 'Mar', Purchase: 48000, Sales: 43000 },
    { name: 'Apr', Purchase: 47000, Sales: 41000 },
    { name: 'May', Purchase: 47000, Sales: 42000 },
    { name: 'Jun', Purchase: 46000, Sales: 39000 },
  ]
  const orderSummaryData = [
    { name: 'Jan', Ordered: 1900, Delivered: 1100 },
    { name: 'Feb', Ordered: 2300, Delivered: 1700 },
    { name: 'Mar', Ordered: 2100, Delivered: 1900 },
    { name: 'Apr', Ordered: 2500, Delivered: 2100 },
    { name: 'May', Ordered: 3000, Delivered: 2200 },
  ]

  // Colors
  const lightGreen = 'bg-green-50'
  const lightOrange = 'bg-orange-50'
  const borderGreen = 'border-green-200'

  if (isLoading) {
    return (
      <div className="center m-50">
        <GroceryLoader />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      {/* Overview Panels */}
      <div
        className={`col-span-1 md:col-span-2 xl:col-span-3 flex w-90% flex-wrap gap-4`}
      >
        <div
          className={`flex-1 p-4 rounded-xl shadow-sm ${lightGreen} border ${borderGreen}`}
        >
          <div className="flex items-center space-x-2">
            <TrendingUp size={18} className="text-green-700" /> Sales Overview
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <div className="text-sm text-gray-500">Sales</div>
              <div className="font-bold text-lg">{totalSales}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Revenue</div>
              <div className="font-bold text-lg">$ {totalRevenue}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Profit</div>
              <div className="font-bold text-lg">$ {profit}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Cost</div>
              <div className="font-bold text-lg">$ {totalCost}</div>
            </div>
          </div>
        </div>

        <div
          className={`flex-1 p-4 rounded-xl shadow-sm ${lightOrange} border border-orange-200`}
        >
          <div className="flex items-center space-x-2">
            <ShoppingCart size={18} className="text-orange-600" /> Purchase
            Overview
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <div className="text-xs text-gray-500">Purchase</div>
              <div className="font-bold">{purchaseOverview.count}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Cost</div>
              <div className="font-bold">$ {purchaseOverview.cost}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Cancel</div>
              <div className="font-bold">{purchaseOverview.cancelled}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Return</div>
              <div className="font-bold">$ {purchaseOverview.returned}</div>
            </div>
          </div>
        </div>

        {/* Top Selling Stock */}
        <div
          className={`flex-1 min-w-[250px] rounded-xl shadow-sm p-4 ${lightGreen} border ${borderGreen}`}
        >
          <div className="font-semibold mb-2">Top Selling Stock</div>
          <table className="w-full text-sm mt-2 border">
            <thead>
              <tr className="bg-green-100">
                <th className="py-1 px-2 text-left">Name</th>
                <th className="py-1 px-2 text-left">Sold Qty</th>
                <th className="py-1 px-2 text-left">Stock Left</th>
                <th className="py-1 px-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {topSelling.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-2">
                    No top selling products.
                  </td>
                </tr>
              )}
              {topSelling.map(({ product, sold }) => (
                <tr key={product.id} className="border-t">
                  <td className="py-1 px-2">{product.product_name}</td>
                  <td className="py-1 px-2">{sold}</td>
                  <td className="py-1 px-2">{product.stock}</td>
                  <td className="py-1 px-2">${product.product_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales & Order Charts */}
      <div className="col-span-1 md:col-span-2 xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`rounded-xl shadow-sm p-4 ${lightGreen} border ${borderGreen}`}
        >
          <div className="font-semibold mb-2">Sales & Purchase</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesPurchaseData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Purchase" fill="#fdba74" />
              <Bar dataKey="Sales" fill="#bef264" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div
          className={`rounded-xl shadow-sm p-4 ${lightOrange} border border-orange-200`}
        >
          <div className="font-semibold mb-2">Order Summary</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={orderSummaryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Ordered"
                stroke="#fdba74"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Delivered"
                stroke="#bef264"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Selling & Low Stock */}
      <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-wrap gap-4 mt-4">
        {/* Top Selling Stock */}

        {/* Low Quantity Stock */}
        <div
          className={`flex-1 min-w-[250px] rounded-xl shadow-sm p-4 ${lightOrange} border border-orange-200`}
        >
          <div className="font-semibold mb-2">Low Quantity Stock</div>
          <div className="space-y-2">
            {lowQuantity.map(({ product }) => (
              <div key={product.id} className="flex items-center gap-3">
                <img
                  src={product.product_image}
                  alt={product.product_name}
                  className="w-8 h-8 rounded shadow"
                />
                <div>
                  <div className="font-semibold">{product.product_name}</div>
                  <div className="text-xs text-gray-500">
                    Remaining Quantity: {product.stock} {product.size}
                  </div>
                </div>
              </div>
            ))}
            {lowQuantity.length === 0 && (
              <div className="text-gray-400 text-xs">
                No low quantity stock found.
              </div>
            )}
          </div>
        </div>
        {/* Inventory */}
        <div
          className={`flex-1 min-w-[200px] p-4 rounded-xl shadow-sm ${lightGreen} border ${borderGreen}`}
        >
          <div className="flex items-center space-x-2">
            <Package size={18} /> Inventory Summary
          </div>
          <div className="mt-2">
            Quantity in Hand:{' '}
            <span className="font-semibold">
              {inventorySummary.quantityInHand}
            </span>
            <br />
            To be received:{' '}
            <span className="font-semibold">
              {inventorySummary.toBeReceived}
            </span>
          </div>
        </div>
        {/* Product summary */}
        <div
          className={`flex-1 min-w-[200px] p-4 rounded-xl shadow-sm ${lightGreen} border ${borderGreen}`}
        >
          <div className="flex items-center space-x-2">
            <Layers size={18} /> Product Summary
          </div>
          <div className="mt-2">
            Number of Suppliers:{' '}
            <span className="font-semibold">{productSummary.suppliers}</span>
            <br />
            Number of Categories:{' '}
            <span className="font-semibold">{productSummary.categories}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
