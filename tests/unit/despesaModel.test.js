const despesaModel = require('../../models/despesaModel');
const { mockQueryResult, mockInsertResult, mockUpdateResult } = require('../mocks/dbMock');

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

describe('DespesaModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listarDespesas', () => {
    test('deve listar despesas do usuário', async () => {
      const usuarioId = 1;
      const despesasMock = [
        { id: 1, descricao: 'Almoço', valor: 25.50, usuario_id: 1 },
        { id: 2, descricao: 'Transporte', valor: 5.75, usuario_id: 1 }
      ];

      dbMock.query.mockResolvedValue(mockQueryResult(despesasMock));

      const result = await despesaModel.listarDespesas(usuarioId);

      expect(dbMock.query).toHaveBeenCalledWith(
        'SELECT * FROM despesas WHERE usuario_id = ?',
        [usuarioId]
      );
      expect(result).toEqual(despesasMock);
    });

    test('deve retornar array vazio quando não há despesas', async () => {
      const usuarioId = 1;

      dbMock.query.mockResolvedValue(mockQueryResult([]));

      const result = await despesaModel.listarDespesas(usuarioId);

      expect(result).toEqual([]);
    });

    test('deve lançar erro quando falhar na consulta', async () => {
      const usuarioId = 1;

      dbMock.query.mockRejectedValue(new Error('Erro na consulta'));

      await expect(despesaModel.listarDespesas(usuarioId))
        .rejects.toThrow('Erro na consulta');
    });
  });

  describe('adicionarDespesa', () => {
    test('deve adicionar uma despesa com sucesso', async () => {
      const despesa = { descricao: 'Almoço', valor: 25.50 };
      const usuarioId = 1;

      dbMock.query.mockResolvedValue(mockInsertResult(1));

      await despesaModel.adicionarDespesa(despesa, usuarioId);

      expect(dbMock.query).toHaveBeenCalledWith(
        'INSERT INTO despesas (descricao, valor, usuario_id) VALUES (?, ?, ?)',
        [despesa.descricao, despesa.valor, usuarioId]
      );
    });

    test('deve adicionar despesa com valor decimal', async () => {
      const despesa = { descricao: 'Transporte', valor: 5.75 };
      const usuarioId = 1;

      dbMock.query.mockResolvedValue(mockInsertResult(1));

      await despesaModel.adicionarDespesa(despesa, usuarioId);

      expect(dbMock.query).toHaveBeenCalledWith(
        'INSERT INTO despesas (descricao, valor, usuario_id) VALUES (?, ?, ?)',
        [despesa.descricao, despesa.valor, usuarioId]
      );
    });

    test('deve lançar erro quando falhar ao adicionar despesa', async () => {
      const despesa = { descricao: 'Almoço', valor: 25.50 };
      const usuarioId = 1;

      dbMock.query.mockRejectedValue(new Error('Erro no banco'));

      await expect(despesaModel.adicionarDespesa(despesa, usuarioId))
        .rejects.toThrow('Erro no banco');
    });
  });

  describe('excluirDespesa', () => {
    test('deve excluir uma despesa com sucesso', async () => {
      const despesaId = 1;
      const usuarioId = 1;

      dbMock.query.mockResolvedValue(mockUpdateResult(1));

      const result = await despesaModel.excluirDespesa(despesaId, usuarioId);

      expect(dbMock.query).toHaveBeenCalledWith(
        'DELETE FROM despesas WHERE id = ? AND usuario_id = ?',
        [despesaId, usuarioId]
      );
      expect(result).toBe(true);
    });

    test('deve retornar false quando despesa não encontrada', async () => {
      const despesaId = 999;
      const usuarioId = 1;

      dbMock.query.mockResolvedValue(mockUpdateResult(0));

      const result = await despesaModel.excluirDespesa(despesaId, usuarioId);

      expect(result).toBe(false);
    });

    test('deve lançar erro quando falhar ao excluir despesa', async () => {
      const despesaId = 1;
      const usuarioId = 1;

      dbMock.query.mockRejectedValue(new Error('Erro no banco'));

      await expect(despesaModel.excluirDespesa(despesaId, usuarioId))
        .rejects.toThrow('Erro no banco');
    });
  });
}); 