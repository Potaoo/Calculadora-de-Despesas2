const request = require('supertest');
const app = require('../../app');

// Helper para criar um agente de teste autenticado
const createAuthenticatedAgent = async (email = 'test@email.com', senha = 'senha123') => {
  const agent = request.agent(app);
  
  // Registrar usuário primeiro
  const registerResponse = await agent.post('/api/register')
    .send({
      nome: 'Usuário Teste',
      email: email,
      senha: senha
    });
  
  // Verificar se o registro foi bem-sucedido
  if (registerResponse.status !== 200) {
    throw new Error(`Falha no registro: ${registerResponse.status} - ${JSON.stringify(registerResponse.body)}`);
  }
  
  return agent;
};

// Helper para limpar dados de teste
const cleanupTestData = async (db) => {
  try {
    await db.query('DELETE FROM despesas WHERE usuario_id IN (SELECT id FROM usuarios WHERE email LIKE "%test%")');
    await db.query('DELETE FROM usuarios WHERE email LIKE "%test%"');
  } catch (error) {
    console.error('Erro ao limpar dados de teste:', error);
  }
};

// Helper para criar usuário diretamente no banco
const createTestUser = async (db, email = 'test@email.com', senha = 'senha123') => {
  const bcrypt = require('bcrypt');
  const senhaCriptografada = await bcrypt.hash(senha, 10);
  
  const [result] = await db.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    ['Usuário Teste', email, senhaCriptografada]
  );
  
  return result.insertId;
};

// Dados de teste padrão
const testData = {
  usuario: {
    nome: 'Usuário Teste',
    email: 'test@email.com',
    senha: 'senha123'
  },
  despesa: {
    descricao: 'Despesa de Teste',
    valor: 25.50
  }
};

module.exports = {
  createAuthenticatedAgent,
  cleanupTestData,
  createTestUser,
  testData
}; 