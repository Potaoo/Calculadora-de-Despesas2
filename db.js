const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

if (process.env.NODE_ENV === 'test') {
  // Use SQLite for testing
  const dbPath = path.join(__dirname, 'test.db');
  db = new sqlite3.Database(dbPath);
  
  // Initialize test database with tables
  db.serialize(() => {
    // Create usuarios table
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL
    )`);
    
    // Create despesas table
    db.run(`CREATE TABLE IF NOT EXISTS despesas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      valor REAL NOT NULL,
      usuario_id INTEGER NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    )`);
  });
  
  // Wrap SQLite methods to match MySQL interface
  db.query = function(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (sql.toLowerCase().includes('insert')) {
        this.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve([{ insertId: this.lastID }, { affectedRows: this.changes }]);
        });
      } else if (sql.toLowerCase().includes('delete') || sql.toLowerCase().includes('update')) {
        this.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve([{ affectedRows: this.changes }, {}]);
        });
      } else {
        this.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve([rows, { affectedRows: rows ? rows.length : 0 }]);
        });
      }
    });
  };
  
  db.execute = db.query;
  
} else {
  // Use MySQL for production
  db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Lcj.456baronesa',
    database: 'calculadora_despesas'
  });
}

module.exports = db;
