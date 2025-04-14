const db = require('../db');

async function criarUsuario(nome, email, senhaCriptografada) {
  const [result] = await db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaCriptografada]);
  return result.insertId;
}

async function buscarPorEmail(email) {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
}

module.exports = { criarUsuario, buscarPorEmail };
