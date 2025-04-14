const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');

async function login(req, res) {
  const { email, senha } = req.body;
  const usuario = await usuarioModel.buscarPorEmail(email);

  if (!usuario || !await bcrypt.compare(senha, usuario.senha)) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  req.session.usuarioId = usuario.id;
  res.json({ sucesso: true });
}

async function register(req, res) {
  const { nome, email, senha } = req.body;
  const senhaCriptografada = await bcrypt.hash(senha, 10);
  const id = await usuarioModel.criarUsuario(nome, email, senhaCriptografada);

  req.session.usuarioId = id;
  res.json({ sucesso: true });
}

async function logout(req, res) {
  req.session.destroy();
  res.json({ sucesso: true });
}

module.exports = { login, register, logout };
