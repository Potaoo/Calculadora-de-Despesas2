const db = require('../db');

async function listarDespesas(usuarioId) {
  const result = await db.query('SELECT * FROM despesas WHERE usuario_id = $1', [usuarioId]);
  return result.rows;
}

async function adicionarDespesa(despesa, usuarioId) {
  await db.query('INSERT INTO despesas (descricao, valor, usuario_id) VALUES ($1, $2, $3)', [
    despesa.descricao,
    despesa.valor,
    usuarioId
  ]);
}

async function excluirDespesa(id, usuarioId) {
  const result = await db.query('DELETE FROM despesas WHERE id = $1 AND usuario_id = $2', [id, usuarioId]);
  return result.rowCount > 0;
}

module.exports = { listarDespesas, adicionarDespesa, excluirDespesa };
