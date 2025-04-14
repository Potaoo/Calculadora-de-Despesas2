const db = require('../db');

async function listarDespesas(usuarioId) {
  const [rows] = await db.query('SELECT * FROM despesas WHERE usuario_id = ?', [usuarioId]);
  return rows;
}

async function adicionarDespesa(despesa, usuarioId) {
  await db.query('INSERT INTO despesas (descricao, valor, data, usuario_id) VALUES (?, ?, ?, ?)', [
    despesa.descricao,
    despesa.valor,
    new Date(),
    usuarioId
  ]);
}

async function excluirDespesa(id, usuarioId) {
  await db.query('DELETE FROM despesas WHERE id = ? AND usuario_id = ?', [id, usuarioId]);
}

module.exports = { listarDespesas, adicionarDespesa, excluirDespesa };
