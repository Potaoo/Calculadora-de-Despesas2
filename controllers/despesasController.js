const despesaModel = require('../models/despesaModel');

async function listarDespesas(req, res) {
  const despesas = await despesaModel.listarDespesas(req.session.usuarioId);
  res.json(despesas);
}

async function adicionarDespesa(req, res) {
  const { descricao, valor } = req.body;
  await despesaModel.adicionarDespesa({ descricao, valor }, req.session.usuarioId);
  res.status(201).json({ sucesso: true });
}

async function excluirDespesa(req, res) {
  const { id } = req.params;
  await despesaModel.excluirDespesa(id, req.session.usuarioId);
  res.json({ sucesso: true });
}

module.exports = { listarDespesas, adicionarDespesa, excluirDespesa };
