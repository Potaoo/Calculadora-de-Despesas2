const request = require('supertest');
const app = require('../../app');

// Helper para criar um agente de teste autenticado
const createAuthenticatedAgent = async (email = 'test@email.com', senha = 'senha123') => {
  const agent = request.agent(app);
  
  // Registrar usuário primeiro
  await agent.post('/api/register')
    .send({
      nome: 'Usuário Teste',
      email: email,
      senha: senha
    });
  
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
  testData
}; 