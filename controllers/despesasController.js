const despesaModel = require('../models/despesaModel');

async function listarDespesas(req, res) {
  try {
    const despesas = await despesaModel.listarDespesas(req.session.usuarioId);
    res.json(despesas);
  } catch (error) {
    console.error('Erro ao listar despesas:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function adicionarDespesa(req, res) {
  try {
    const { descricao, valor } = req.body;
    
    if (!descricao || !valor) {
      return res.status(400).json({ erro: 'Descrição e valor são obrigatórios' });
    }
    
    if (typeof valor !== 'number' || valor <= 0) {
      return res.status(400).json({ erro: 'Valor deve ser um número positivo' });
    }
    
    await despesaModel.adicionarDespesa({ descricao, valor }, req.session.usuarioId);
    res.status(201).json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao adicionar despesa:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function excluirDespesa(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ erro: 'ID inválido' });
    }
    
    const resultado = await despesaModel.excluirDespesa(id, req.session.usuarioId);
    
    if (!resultado) {
      return res.status(404).json({ erro: 'Despesa não encontrada' });
    }
    
    res.json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao excluir despesa:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

module.exports = { listarDespesas, adicionarDespesa, excluirDespesa };
