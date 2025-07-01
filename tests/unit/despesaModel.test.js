const despesaModel = require('../../models/despesaModel');
const { mockQueryResult, mockUpdateResult } = require('../mocks/dbMock');

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
    test('deve listar despesas de um usuário', async () => {
      const usuarioId = 1;
      const despesasMock = [
        { id: 1, descricao: 'Almoço', valor: 25.50, data: '2024-01-15', usuario_id: 1 },
        { id: 2, descricao: 'Transporte', valor: 5.00, data: '2024-01-15', usuario_id: 1 }
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
      const usuarioId = 2;

      dbMock.query.mockResolvedValue(mockQueryResult([]));

      const result = await despesaModel.listarDespesas(usuarioId);

      expect(result).toEqual([]);
      expect(dbMock.query).toHaveBeenCalledWith(
        'SELECT * FROM despesas WHERE usuario_id = ?',
        [usuarioId]
      );
    });

    test('deve lançar erro quando falhar na listagem', async () => {
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

      dbMock.query.mockResolvedValue(mockUpdateResult(1));

      await despesaModel.adicionarDespesa(despesa, usuarioId);

      expect(dbMock.query).toHaveBeenCalledWith(
        'INSERT INTO despesas (descricao, valor, data, usuario_id) VALUES (?, ?, ?, ?)',
        [despesa.descricao, despesa.valor, expect.any(Date), usuarioId]
      );
    });

    test('deve adicionar despesa com valor decimal', async () => {
      const despesa = { descricao: 'Transporte', valor: 5.75 };
      const usuarioId = 1;

      dbMock.query.mockResolvedValue(mockUpdateResult(1));

      await despesaModel.adicionarDespesa(despesa, usuarioId);

      expect(dbMock.query).toHaveBeenCalledWith(
        'INSERT INTO despesas (descricao, valor, data, usuario_id) VALUES (?, ?, ?, ?)',
        [despesa.descricao, despesa.valor, expect.any(Date), usuarioId]
      );
    });

    test('deve lançar erro quando falhar ao adicionar despesa', async () => {
      const despesa = { descricao: 'Almoço', valor: 25.50 };
      const usuarioId = 1;

      dbMock.query.mockRejectedValue(new Error('Erro no banco de dados'));

      await expect(despesaModel.adicionarDespesa(despesa, usuarioId))
        .rejects.toThrow('Erro no banco de dados');
    });

    test('deve usar data atual ao adicionar despesa', async () => {
      const despesa = { descricao: 'Teste', valor: 10.00 };
      const usuarioId = 1;
      const dataAtual = new Date();

      dbMock.query.mockResolvedValue(mockUpdateResult(1));

      await despesaModel.adicionarDespesa(despesa, usuarioId);

      const callArgs = dbMock.query.mock.calls[0][1];
      expect(callArgs[2]).toBeInstanceOf(Date);
      expect(callArgs[2].getTime()).toBeGreaterThanOrEqual(dataAtual.getTime() - 1000);
    });
  });

  describe('excluirDespesa', () => {
    test('deve excluir uma despesa com sucesso', async () => {
      const despesaId = 1;
      const usuarioId = 1;

      dbMock.query.mockResolvedValue(mockUpdateResult(1));

      await despesaModel.excluirDespesa(despesaId, usuarioId);

      expect(dbMock.query).toHaveBeenCalledWith(
        'DELETE FROM despesas WHERE id = ? AND usuario_id = ?',
        [despesaId, usuarioId]
      );
    });

    test('deve excluir despesa de usuário específico', async () => {
      const despesaId = 2;
      const usuarioId = 3;

      dbMock.query.mockResolvedValue(mockUpdateResult(1));

      await despesaModel.excluirDespesa(despesaId, usuarioId);

      expect(dbMock.query).toHaveBeenCalledWith(
        'DELETE FROM despesas WHERE id = ? AND usuario_id = ?',
        [despesaId, usuarioId]
      );
    });

    test('deve lançar erro quando falhar ao excluir despesa', async () => {
      const despesaId = 1;
      const usuarioId = 1;

      dbMock.query.mockRejectedValue(new Error('Erro no banco de dados'));

      await expect(despesaModel.excluirDespesa(despesaId, usuarioId))
        .rejects.toThrow('Erro no banco de dados');
    });

    test('deve verificar se despesa pertence ao usuário', async () => {
      const despesaId = 5;
      const usuarioId = 10;

      dbMock.query.mockResolvedValue(mockUpdateResult(0));

      await despesaModel.excluirDespesa(despesaId, usuarioId);

      expect(dbMock.query).toHaveBeenCalledWith(
        'DELETE FROM despesas WHERE id = ? AND usuario_id = ?',
        [despesaId, usuarioId]
      );
    });
  });
}); 