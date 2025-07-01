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