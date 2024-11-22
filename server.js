const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware to parse JSON data
app.use(cors());
app.use(bodyParser.json());

// MySQL Database connection
// const db = mysql.createConnection({
//   host: 'localhost',     // Replace with your MySQL host
//   port: 3306,            // Replace with your MySQL port
//   user: 'root',          // Replace with your MySQL user
//   password: 'root',  // Replace with your MySQL password
//   database: 'company_db'      // Replace with your MySQL database name
// });
const db = mysql.createConnection({
  host: process.env.DB_HOST, // Use the environment variable
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});


// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// API endpoint to fetch all company data
app.get('/company', (req, res) => {
  const sqlQuery = 'SELECT * FROM company'; // Query to select all data from company table
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error fetching company data:', err);
      res.status(500).send({ message: 'Database error' });
    } else {
      res.json(result); // Send back the result in JSON format
      console.log(result);
    }
  });
});

// API endpoint to fetch product data based on item name and variety
// app.get('/product', (req, res) => {
//   const { item_name, variety } = req.query;

//   // SQL query to select item_name, variety, and hsn from the product table where item_name and variety match
//   const sqlQuery = 'SELECT item_name, variety, hsn FROM product WHERE item_name = ? AND variety = ?';
  
//   db.query(sqlQuery, [item_name, variety], (err, result) => {
//     if (err) {
//       console.error('Error fetching product data:', err);
//       res.status(500).send({ message: 'Database error' });
//     } else {
//       res.json(result); // Send back the result in JSON format
//       console.log(result);
//     }
//   });
// });

// API endpoint to get items
app.get("/items", (req, res) => {
  db.query("SELECT * FROM items", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
// // API endpoint to fetch a specific company by ID
// app.get('/api/company/:id', (req, res) => {
//   const companyId = req.params.id;
//   const sqlQuery = 'SELECT * FROM company WHERE companyid = ?';

//   db.query(sqlQuery, [companyId], (err, result) => {
//     if (err) {
//       console.error('Error fetching company data:', err);
//       res.status(500).send({ message: 'Database error' });
//     } else if (result.length === 0) {
//       res.status(404).send({ message: 'Company not found' });
//     } else {
//       res.json(result[0]); // Send the company details as a JSON response
//     }
//   });
// });

// Serve the React build folder
app.use(express.static(path.join(__dirname, 'build')));

// Fallback for React Router
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
