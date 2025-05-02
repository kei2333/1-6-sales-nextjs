const express = require('express');
const mysql = require('mysql2/promise');
const dbConfig = require('./dbconfig');

const app = express();
app.use(express.json());

// ✅ 売上データ取得 API
app.get('/sales-report', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute('SELECT * FROM sales_report');
    res.json(rows);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).send('Error fetching sales data');
  } finally {
    await connection.end();
  }
});

// ✅ 売上データ挿入 API
app.post('/sales-report', async (req, res) => {
  const salesData = req.body; // 例: [{ sales_date, location_id, amount, ... }, {...}]
  const connection = await mysql.createConnection(dbConfig);

  try {
    await connection.beginTransaction();

    for (const sale of salesData) {
      await connection.execute(
        `INSERT INTO sales_report (sales_date, location_id, amount, sales_channel, category, tactics, employee_number, memo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sale.sales_date,
          sale.location_id,
          sale.amount,
          sale.sales_channel,
          sale.category,
          sale.tactics,
          sale.employee_number,
          sale.memo || null,
        ]
      );
    }

    await connection.commit();
    res.send('Sales data inserted successfully');
  } catch (err) {
    await connection.rollback();
    console.error('Insert error:', err);
    res.status(500).send('Error inserting sales data');
  } finally {
    await connection.end();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
