require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: 'haesoo',
  password: process.env.PASSWORD,
  port: 3306,
  database: 'FORUM'
})

connection.connect((err) => {
  if(!err) { console.log('MySQL Connection Succeeded.'); }
  else { console.log('Error in MySQL Connection : ' + err)}
});

module.exports = connection;