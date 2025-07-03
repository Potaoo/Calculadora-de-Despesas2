// Configuração global para testes
process.env.NODE_ENV = 'test';

// Mock do console.log para evitar logs durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

const db = require('../db');

beforeAll(async () => {
  if (db.initTestTables) {
    await db.initTestTables();
  }
});

beforeEach(async () => {
  // Limpar dados de teste do SQLite
  if (db && db.query) {
    try {
      await db.query('DELETE FROM despesas');
      await db.query('DELETE FROM usuarios');
    } catch (error) {
      // Ignorar erros de limpeza
    }
  }
});

afterAll(async () => {
  // Fechar conexão do SQLite
  if (db && db.close) {
    try {
      await new Promise((resolve) => db.close(resolve));
    } catch (error) {
      // Ignorar erros de fechamento
    }
  }
}); 