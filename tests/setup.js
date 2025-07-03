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

// Cleanup do banco de dados SQLite após cada teste
const fs = require('fs');
const path = require('path');

beforeEach(async () => {
  // Limpar dados de teste do SQLite
  const db = require('../db');
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
  const db = require('../db');
  if (db && db.close) {
    try {
      await new Promise((resolve) => db.close(resolve));
    } catch (error) {
      // Ignorar erros de fechamento
    }
  }
  
  // Remover arquivo de banco de teste com delay
  setTimeout(() => {
    const testDbPath = path.join(__dirname, '..', 'test.db');
    if (fs.existsSync(testDbPath)) {
      try {
        fs.unlinkSync(testDbPath);
      } catch (error) {
        // Ignorar erros de remoção
      }
    }
  }, 1000);
}); 