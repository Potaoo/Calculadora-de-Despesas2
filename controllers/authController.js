const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }
    
    const usuario = await usuarioModel.buscarPorEmail(email);

    if (!usuario || !await bcrypt.compare(senha, usuario.senha)) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    req.session.usuarioId = usuario.id;
    res.json({ sucesso: true });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function register(req, res) {
  try {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
    }
    
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const id = await usuarioModel.criarUsuario(nome, email, senhaCriptografada);

    req.session.usuarioId = id;
    res.json({ sucesso: true });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function logout(req, res) {
  try {
    req.session.destroy();
    res.json({ sucesso: true });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

module.exports = { login, register, logout };
