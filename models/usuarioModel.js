const db = require('../db');

async function criarUsuario(nome, email, senhaCriptografada) {
  const result = await db.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id',
    [nome, email, senhaCriptografada]
  );
  return result.rows[0].id;
}

async function buscarPorEmail(email) {
  const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return result.rows[0];
}

module.exports = { criarUsuario, buscarPorEmail };
