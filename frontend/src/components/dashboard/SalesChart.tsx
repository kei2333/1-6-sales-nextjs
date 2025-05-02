'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const data = [
  { date: '23 Nov', value: 22000 },
  { date: '24', value: 24000 },
  { date: '25', value: 29000 },
  { date: '26', value: 31000 },
  { date: '27', value: 35000 },
  { date: '28', value: 42000 },
  { date: '29', value: 46000 },
  { date: '30', value: 49000 },
]

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(value) => `¥${value.toLocaleString()}`} />
        <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#000"
          strokeWidth={3}
          dot={{ r: 4, fill: '#000' }}
          activeDot={{ r: 8, fill: '#00000022' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
