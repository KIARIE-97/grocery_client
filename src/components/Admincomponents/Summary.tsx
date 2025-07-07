import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// Define a type for the chart's data points
interface ChartData {
  name: string
  income: number
  orders: number
}

const data: ChartData[] = [
  { name: 'Jan', income: 4000, orders: 2400 },
  { name: 'Feb', income: 3000, orders: 1398 },
  { name: 'Mar', income: 2000, orders: 9800 },
  { name: 'Apr', income: 2780, orders: 3908 },
  { name: 'May', income: 1890, orders: 4800 },
  { name: 'Jun', income: 2390, orders: 3800 },
  { name: 'Jul', income: 3490, orders: 4300 },
  { name: 'Aug', income: 4000, orders: 2400 },
  { name: 'Sep', income: 3000, orders: 1398 },
  { name: 'Oct', income: 2000, orders: 9800 },
  { name: 'Nov', income: 2780, orders: 3908 },
  { name: 'Dec', income: 1890, orders: 4800 },
]

const IncomeSummary: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="income"
          stackId="1"
          stroke="#ff7300"
          fill="#ff7300"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="orders"
          stackId="1"
          stroke="#387908"
          fill="#387908"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default IncomeSummary
