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

type Props = {
  data: { date: string; value: number }[]
}

export function SalesChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart 
      data={data}
      margin={{ top: 10, right: 20, bottom: 20, left: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(v) => `¥${v.toLocaleString()}`} />
        <Tooltip formatter={(v) => `¥${v.toLocaleString()}`} />
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
