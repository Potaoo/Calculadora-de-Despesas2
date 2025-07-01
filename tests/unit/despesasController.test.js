const despesasController = require('../../controllers/despesasController');
const despesaModel = require('../../models/despesaModel');

// Mock do módulo
jest.mock('../../models/despesaModel');

describe('DespesasController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      body: {},
      params: {},
      session: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('listarDespesas', () => {
    test('deve listar despesas do usuário autenticado', async () => {
      const usuarioId = 1;
      const despesasMock = [
        { id: 1, descricao: 'Almoço', valor: 25.50, data: '2024-01-15', usuario_id: 1 },
        { id: 2, descricao: 'Transporte', valor: 5.00, data: '2024-01-15', usuario_id: 1 }
      ];

      mockReq.session.usuarioId = usuarioId;
      despesaModel.listarDespesas.mockResolvedValue(despesasMock);

      await despesasController.listarDespesas(mockReq, mockRes);

      expect(despesaModel.listarDespesas).toHaveBeenCalledWith(usuarioId);
      expect(mockRes.json).toHaveBeenCalledWith(despesasMock);
    });

    test('deve retornar lista vazia quando não há despesas', async () => {
      const usuarioId = 2;

      mockReq.session.usuarioId = usuarioId;
      despesaModel.listarDespesas.mockResolvedValue([]);

      await despesasController.listarDespesas(mockReq, mockRes);

      expect(despesaModel.listarDespesas).toHaveBeenCalledWith(usuarioId);
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    test('deve lançar erro quando falhar na listagem', async () => {
      const usuarioId = 1;

      mockReq.session.usuarioId = usuarioId;
      despesaModel.listarDespesas.mockRejectedValue(new Error('Erro no banco'));

      await expect(despesasController.listarDespesas(mockReq, mockRes))
        .rejects.toThrow('Erro no banco');
    });

    test('deve usar o ID do usuário da sessão', async () => {
      const usuarioId = 5;

      mockReq.session.usuarioId = usuarioId;
      despesaModel.listarDespesas.mockResolvedValue([]);

      await despesasController.listarDespesas(mockReq, mockRes);

      expect(despesaModel.listarDespesas).toHaveBeenCalledWith(usuarioId);
    });
  });

  describe('adicionarDespesa', () => {
    test('deve adicionar uma nova despesa com sucesso', async () => {
      const usuarioId = 1;
      const despesa = { descricao: 'Almoço', valor: 25.50 };

      mockReq.session.usuarioId = usuarioId;
      mockReq.body = despesa;
      despesaModel.adicionarDespesa.mockResolvedValue();

      await despesasController.adicionarDespesa(mockReq, mockRes);

      expect(despesaModel.adicionarDespesa).toHaveBeenCalledWith(despesa, usuarioId);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ sucesso: true });
    });

    test('deve adicionar despesa com valor decimal', async () => {
      const usuarioId = 1;
      const despesa = { descricao: 'Transporte', valor: 5.75 };

      mockReq.session.usuarioId = usuarioId;
      mockReq.body = despesa;
      despesaModel.adicionarDespesa.mockResolvedValue();

      await despesasController.adicionarDespesa(mockReq, mockRes);

      expect(despesaModel.adicionarDespesa).toHaveBeenCalledWith(despesa, usuarioId);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    test('deve adicionar despesa para usuário específico', async () => {
      const usuarioId = 3;
      const despesa = { descricao: 'Teste', valor: 10.00 };

      mockReq.session.usuarioId = usuarioId;
      mockReq.body = despesa;
      despesaModel.adicionarDespesa.mockResolvedValue();

      await despesasController.adicionarDespesa(mockReq, mockRes);

      expect(despesaModel.adicionarDespesa).toHaveBeenCalledWith(despesa, usuarioId);
    });

    test('deve lançar erro quando falhar ao adicionar despesa', async () => {
      const usuarioId = 1;
      const despesa = { descricao: 'Almoço', valor: 25.50 };

      mockReq.session.usuarioId = usuarioId;
      mockReq.body = despesa;
      despesaModel.adicionarDespesa.mockRejectedValue(new Error('Erro no banco'));

      await expect(despesasController.adicionarDespesa(mockReq, mockRes))
        .rejects.toThrow('Erro no banco');
    });
  });

  describe('excluirDespesa', () => {
    test('deve excluir uma despesa com sucesso', async () => {
      const usuarioId = 1;
      const despesaId = 1;

      mockReq.session.usuarioId = usuarioId;
      mockReq.params.id = despesaId;
      despesaModel.excluirDespesa.mockResolvedValue();

      await despesasController.excluirDespesa(mockReq, mockRes);

      expect(despesaModel.excluirDespesa).toHaveBeenCalledWith(despesaId, usuarioId);
      expect(mockRes.json).toHaveBeenCalledWith({ sucesso: true });
    });

    test('deve excluir despesa específica do usuário', async () => {
      const usuarioId = 2;
      const despesaId = 5;

      mockReq.session.usuarioId = usuarioId;
      mockReq.params.id = despesaId;
      despesaModel.excluirDespesa.mockResolvedValue();

      await despesasController.excluirDespesa(mockReq, mockRes);

      expect(despesaModel.excluirDespesa).toHaveBeenCalledWith(despesaId, usuarioId);
    });

    test('deve usar ID da URL e usuário da sessão', async () => {
      const usuarioId = 1;
      const despesaId = '10';

      mockReq.session.usuarioId = usuarioId;
      mockReq.params.id = despesaId;
      despesaModel.excluirDespesa.mockResolvedValue();

      await despesasController.excluirDespesa(mockReq, mockRes);

      expect(despesaModel.excluirDespesa).toHaveBeenCalledWith(despesaId, usuarioId);
    });

    test('deve lançar erro quando falhar ao excluir despesa', async () => {
      const usuarioId = 1;
      const despesaId = 1;

      mockReq.session.usuarioId = usuarioId;
      mockReq.params.id = despesaId;
      despesaModel.excluirDespesa.mockRejectedValue(new Error('Erro no banco'));

      await expect(despesasController.excluirDespesa(mockReq, mockRes))
        .rejects.toThrow('Erro no banco');
    });
  });
}); 