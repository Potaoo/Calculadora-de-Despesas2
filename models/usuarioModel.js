const db = require('../db');

async function criarUsuario(nome, email, senhaCriptografada) {
  const [result] = await db.query('INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)', [nome, email, senhaCriptografada]);
  return result.insertId;
}

async function buscarPorEmail(email) {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return rows[0];
}

module.exports = { criarUsuario, buscarPorEmail };
