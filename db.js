const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

function initTestTables() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS despesas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        usuario_id INTEGER NOT NULL,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
      )`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

if (process.env.NODE_ENV === 'test') {
  // Use SQLite in-memory for testing
  db = new sqlite3.Database(':memory:');
  // Tables will be created in test setup
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
  // Use PostgreSQL for production
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'calculadora_despesas',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  db = {
    query: (text, params) => pool.query(text, params),
    execute: (text, params) => pool.query(text, params)
  };
}

module.exports = db;
module.exports.initTestTables = initTestTables;
