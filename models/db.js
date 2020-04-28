const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '10181018',
  port: 3306,
  database: 'haesoo'
})

connection.connect((err) => {
  if(!err) { console.log('MySQL Connection Succeeded.')}
  else { console.log('Error in MySQL Connection : ' + err)}
});