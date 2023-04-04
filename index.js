const express = require('express');
const queries = require('./queries');

const app = express();
const PORT = 3306;

// define the API routes
app.get('/departments', async (req, res) => {
  try {
    const [rows] = await queries.getAllDepartments();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/roles', async (req, res) => {
  try {
    const [rows] = await queries.getAllRoles();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/employees', async (req, res) => {
  try {
    const [rows] = await queries.getAllEmployees();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});