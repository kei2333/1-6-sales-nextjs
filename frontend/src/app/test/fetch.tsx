'use client';
import { useEffect, useState } from 'react';

export default function SalesFetcher() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch('/api/get-sales?sales_date=2025-03-03&location_id=2');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch sales data');
      }
    }

    fetchSales();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data || data.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h2>Sales Data</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Location</th>
            <th>Amount</th>
            <th>Channel</th>
            <th>Category</th>
            <th>Tactics</th>
            <th>Employees</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.sales_date}</td>
              <td>{sale.location_id}</td>
              <td>{sale.amount}</td>
              <td>{sale.sales_channel}</td>
              <td>{sale.category}</td>
              <td>{sale.tactics}</td>
              <td>{sale.employee_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
