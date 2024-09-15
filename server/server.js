const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');
const cors = require('cors'); // Import CORS

const app = express();
const port = 3001;

app.use(cors()); 


// Create a connection 
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'hodlinfo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create a table if it does not exist

const createTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS top10_cryptos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      platform VARCHAR(255),
      lastprice DECIMAL(18, 8),
      buyprice DECIMAL(18, 8),
      sellprice DECIMAL(18, 8),
      diff DECIMAL(18, 8),
      saving DECIMAL(18, 8)
    );
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
    console.log('Table created or already exists');
  });
};

createTable();

// Fetch data from WazirX API
const fetchData = async () => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = Object.values(response.data); // Top 10 results

    for (const crypto of data) {
      const { name: platform, last, buy, sell, volume } = crypto;
      const diff = (buy - sell).toFixed(3);
      const saving = (volume * diff).toFixed(3);

      pool.query(
        `INSERT INTO top10_cryptos (platform, lastprice, buyprice, sellprice, diff, saving)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [platform, last, buy, sell, diff, saving],
        (err, results) => {
          if (err) {
            console.error('Error inserting data:', err);
            return;
          }
          console.log('Data inserted successfully');
        }
      );
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};




// Route to get data from MySQL
app.get('/api/cryptos', (req, res) => {
  const query = 'SELECT * FROM top10_cryptos';
  
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      res.status(500).send('Error fetching data from the database');
      return;
    }
    console.log('Fetched data:', results); // Log the fetched results
    res.json(results);
  });
});

// Run the fetch data function on server start
fetchData();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
