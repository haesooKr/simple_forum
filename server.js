require('./models/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const express = require('express');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const app = express();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
  res.send('Server HomePage')
})