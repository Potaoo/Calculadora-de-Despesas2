const usuarioModel = require('../../models/usuarioModel');
const { mockQueryResult, mockInsertResult } = require('../mocks/dbMock');

// Mock do módulo db
jest.mock('../../db', () => {
  return {
    query: jest.fn(),
    execute: jest.fn(),
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn()
  };
});
const dbMock = require('../../db');

describe('UsuarioModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criarUsuario', () => {
    test('deve criar um usuário com sucesso', async () => {
      const nome = 'João Silva';
      const email = 'joao@email.com';
      const senhaCriptografada = 'senha_hash_123';
      const insertId = 1;

      dbMock.query.mockResolvedValue(mockInsertResult(insertId));

      const result = await usuarioModel.criarUsuario(nome, email, senhaCriptografada);

      expect(dbMock.query).toHaveBeenCalledWith(
        'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)',
        [nome, email, senhaCriptografada]
      );
      expect(result).toBe(insertId);
    });

    test('deve lançar erro quando falhar ao criar usuário', async () => {
      const nome = 'João Silva';
      const email = 'joao@email.com';
      const senhaCriptografada = 'senha_hash_123';

      dbMock.query.mockRejectedValue(new Error('Erro no banco de dados'));

      await expect(usuarioModel.criarUsuario(nome, email, senhaCriptografada))
        .rejects.toThrow('Erro no banco de dados');
    });

    test('deve criar usuário com dados válidos', async () => {
      const nome = 'Maria Santos';
      const email = 'maria@email.com';
      const senhaCriptografada = 'outra_senha_hash';
      const insertId = 2;

      dbMock.query.mockResolvedValue(mockInsertResult(insertId));

      const result = await usuarioModel.criarUsuario(nome, email, senhaCriptografada);

      expect(result).toBe(insertId);
      expect(dbMock.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('buscarPorEmail', () => {
    test('deve encontrar usuário por email', async () => {
      const email = 'joao@email.com';
      const usuarioMock = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: 'senha_hash_123'
      };

      dbMock.query.mockResolvedValue(mockQueryResult([usuarioMock]));

      const result = await usuarioModel.buscarPorEmail(email);

      expect(dbMock.query).toHaveBeenCalledWith(
        'SELECT * FROM usuarios WHERE email = $1',
        [email]
      );
      expect(result).toEqual(usuarioMock);
    });

    test('deve retornar undefined quando usuário não encontrado', async () => {
      const email = 'inexistente@email.com';

      dbMock.query.mockResolvedValue(mockQueryResult([]));

      const result = await usuarioModel.buscarPorEmail(email);

      expect(result).toBeUndefined();
      expect(dbMock.query).toHaveBeenCalledWith(
        'SELECT * FROM usuarios WHERE email = $1',
        [email]
      );
    });

    test('deve lançar erro quando falhar na busca', async () => {
      const email = 'joao@email.com';

      dbMock.query.mockRejectedValue(new Error('Erro na consulta'));

      await expect(usuarioModel.buscarPorEmail(email))
        .rejects.toThrow('Erro na consulta');
    });

    test('deve buscar usuário com email válido', async () => {
      const email = 'maria@email.com';
      const usuarioMock = {
        id: 2,
        nome: 'Maria Santos',
        email: 'maria@email.com',
        senha: 'outra_senha_hash'
      };

      dbMock.query.mockResolvedValue(mockQueryResult([usuarioMock]));

      const result = await usuarioModel.buscarPorEmail(email);

      expect(result).toEqual(usuarioMock);
      expect(dbMock.query).toHaveBeenCalledTimes(1);
    });
  });
}); 