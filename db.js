const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Lcj.456baronesa',
  database: 'calculadora_despesas'
});

module.exports = db;
