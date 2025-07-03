const despesasController = require('../../controllers/despesasController');
const despesaModel = require('../../models/despesaModel');

// Mock do módulo despesaModel
jest.mock('../../models/despesaModel');

describe('DespesasController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      body: {},
      params: {},
      session: { usuarioId: 1 }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('listarDespesas', () => {
    test('deve listar despesas do usuário', async () => {
      const despesasMock = [
        { id: 1, descricao: 'Almoço', valor: 25.50, usuario_id: 1 },
        { id: 2, descricao: 'Transporte', valor: 5.75, usuario_id: 1 }
      ];

      despesaModel.listarDespesas.mockResolvedValue(despesasMock);

      await despesasController.listarDespesas(mockReq, mockRes);

      expect(despesaModel.listarDespesas).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(despesasMock);
    });

    test('deve retornar erro interno quando falhar na listagem', async () => {
      despesaModel.listarDespesas.mockRejectedValue(new Error('Erro no banco'));

      await despesasController.listarDespesas(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' });
    });
  });

  describe('adicionarDespesa', () => {
    test('deve adicionar uma despesa com sucesso', async () => {
      const novaDespesa = {
        descricao: 'Almoço',
        valor: 25.50
      };

      mockReq.body = novaDespesa;

      await despesasController.adicionarDespesa(mockReq, mockRes);

      expect(despesaModel.adicionarDespesa).toHaveBeenCalledWith(novaDespesa, 1);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ sucesso: true });
    });

    test('deve adicionar despesa com valor decimal', async () => {
      const novaDespesa = {
        descricao: 'Transporte',
        valor: 5.75
      };

      mockReq.body = novaDespesa;

      await despesasController.adicionarDespesa(mockReq, mockRes);

      expect(despesaModel.adicionarDespesa).toHaveBeenCalledWith(novaDespesa, 1);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ sucesso: true });
    });

    test('deve retornar erro quando descrição está faltando', async () => {
      mockReq.body = {
        valor: 25.50
      };

      await despesasController.adicionarDespesa(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Descrição e valor são obrigatórios' });
    });

    test('deve retornar erro quando valor está faltando', async () => {
      mockReq.body = {
        descricao: 'Almoço'
      };

      await despesasController.adicionarDespesa(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Descrição e valor são obrigatórios' });
    });

    test('deve retornar erro quando valor não é número', async () => {
      mockReq.body = {
        descricao: 'Almoço',
        valor: 'não é número'
      };

      await despesasController.adicionarDespesa(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Valor deve ser um número positivo' });
    });

    test('deve retornar erro quando valor é negativo', async () => {
      mockReq.body = {
        descricao: 'Almoço',
        valor: -10
      };

      await despesasController.adicionarDespesa(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Valor deve ser um número positivo' });
    });

    test('deve retornar erro interno quando falhar ao adicionar despesa', async () => {
      const novaDespesa = {
        descricao: 'Almoço',
        valor: 25.50
      };

      mockReq.body = novaDespesa;
      despesaModel.adicionarDespesa.mockRejectedValue(new Error('Erro no banco'));

      await despesasController.adicionarDespesa(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' });
    });
  });

  describe('excluirDespesa', () => {
    test('deve excluir uma despesa com sucesso', async () => {
      const despesaId = 1;

      mockReq.params = { id: despesaId };
      despesaModel.excluirDespesa.mockResolvedValue(true);

      await despesasController.excluirDespesa(mockReq, mockRes);

      expect(despesaModel.excluirDespesa).toHaveBeenCalledWith(despesaId, 1);
      expect(mockRes.json).toHaveBeenCalledWith({ sucesso: true });
    });

    test('deve retornar erro quando ID é inválido', async () => {
      mockReq.params = { id: 'inválido' };

      await despesasController.excluirDespesa(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'ID inválido' });
    });

    test('deve retornar erro quando despesa não encontrada', async () => {
      const despesaId = 999;

      mockReq.params = { id: despesaId };
      despesaModel.excluirDespesa.mockResolvedValue(false);

      await despesasController.excluirDespesa(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Despesa não encontrada' });
    });

    test('deve retornar erro interno quando falhar ao excluir despesa', async () => {
      const despesaId = 1;

      mockReq.params = { id: despesaId };
      despesaModel.excluirDespesa.mockRejectedValue(new Error('Erro no banco'));

      await despesasController.excluirDespesa(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' });
    });
  });
}); 