const authController = require('../../controllers/authController');
const bcrypt = require('bcrypt');
const usuarioModel = require('../../models/usuarioModel');

// Mock dos módulos
jest.mock('bcrypt');
jest.mock('../../models/usuarioModel');

describe('AuthController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      body: {},
      session: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('login', () => {
    test('deve fazer login com credenciais válidas', async () => {
      const email = 'joao@email.com';
      const senha = 'senha123';
      const usuarioMock = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: 'senha_hash_123'
      };

      mockReq.body = { email, senha };
      usuarioModel.buscarPorEmail.mockResolvedValue(usuarioMock);
      bcrypt.compare.mockResolvedValue(true);

      await authController.login(mockReq, mockRes);

      expect(usuarioModel.buscarPorEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(senha, usuarioMock.senha);
      expect(mockReq.session.usuarioId).toBe(usuarioMock.id);
      expect(mockRes.json).toHaveBeenCalledWith({ sucesso: true });
    });

    test('deve retornar erro com credenciais inválidas - usuário não encontrado', async () => {
      const email = 'inexistente@email.com';
      const senha = 'senha123';

      mockReq.body = { email, senha };
      usuarioModel.buscarPorEmail.mockResolvedValue(null);

      await authController.login(mockReq, mockRes);

      expect(usuarioModel.buscarPorEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Credenciais inválidas' });
    });

    test('deve retornar erro com credenciais inválidas - senha incorreta', async () => {
      const email = 'joao@email.com';
      const senha = 'senha_errada';
      const usuarioMock = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: 'senha_hash_123'
      };

      mockReq.body = { email, senha };
      usuarioModel.buscarPorEmail.mockResolvedValue(usuarioMock);
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(mockReq, mockRes);

      expect(usuarioModel.buscarPorEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(senha, usuarioMock.senha);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Credenciais inválidas' });
    });

    test('deve lançar erro quando falhar na busca do usuário', async () => {
      const email = 'joao@email.com';
      const senha = 'senha123';

      mockReq.body = { email, senha };
      usuarioModel.buscarPorEmail.mockRejectedValue(new Error('Erro no banco'));

      await expect(authController.login(mockReq, mockRes))
        .rejects.toThrow('Erro no banco');
    });
  });

  describe('register', () => {
    test('deve registrar um novo usuário com sucesso', async () => {
      const nome = 'Maria Santos';
      const email = 'maria@email.com';
      const senha = 'senha123';
      const senhaCriptografada = 'senha_hash_456';
      const usuarioId = 2;

      mockReq.body = { nome, email, senha };
      bcrypt.hash.mockResolvedValue(senhaCriptografada);
      usuarioModel.criarUsuario.mockResolvedValue(usuarioId);

      await authController.register(mockReq, mockRes);

      expect(bcrypt.hash).toHaveBeenCalledWith(senha, 10);
      expect(usuarioModel.criarUsuario).toHaveBeenCalledWith(nome, email, senhaCriptografada);
      expect(mockReq.session.usuarioId).toBe(usuarioId);
      expect(mockRes.json).toHaveBeenCalledWith({ sucesso: true });
    });

    test('deve registrar usuário com dados válidos', async () => {
      const nome = 'Pedro Costa';
      const email = 'pedro@email.com';
      const senha = 'outra_senha';
      const senhaCriptografada = 'outra_senha_hash';
      const usuarioId = 3;

      mockReq.body = { nome, email, senha };
      bcrypt.hash.mockResolvedValue(senhaCriptografada);
      usuarioModel.criarUsuario.mockResolvedValue(usuarioId);

      await authController.register(mockReq, mockRes);

      expect(bcrypt.hash).toHaveBeenCalledWith(senha, 10);
      expect(usuarioModel.criarUsuario).toHaveBeenCalledWith(nome, email, senhaCriptografada);
      expect(mockReq.session.usuarioId).toBe(usuarioId);
    });

    test('deve lançar erro quando falhar na criptografia', async () => {
      const nome = 'João Silva';
      const email = 'joao@email.com';
      const senha = 'senha123';

      mockReq.body = { nome, email, senha };
      bcrypt.hash.mockRejectedValue(new Error('Erro na criptografia'));

      await expect(authController.register(mockReq, mockRes))
        .rejects.toThrow('Erro na criptografia');
    });

    test('deve lançar erro quando falhar na criação do usuário', async () => {
      const nome = 'João Silva';
      const email = 'joao@email.com';
      const senha = 'senha123';
      const senhaCriptografada = 'senha_hash_123';

      mockReq.body = { nome, email, senha };
      bcrypt.hash.mockResolvedValue(senhaCriptografada);
      usuarioModel.criarUsuario.mockRejectedValue(new Error('Erro no banco'));

      await expect(authController.register(mockReq, mockRes))
        .rejects.toThrow('Erro no banco');
    });
  });

  describe('logout', () => {
    test('deve fazer logout com sucesso', async () => {
      mockReq.session.destroy = jest.fn();

      await authController.logout(mockReq, mockRes);

      expect(mockReq.session.destroy).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({ sucesso: true });
    });

    test('deve destruir a sessão ao fazer logout', async () => {
      const destroyMock = jest.fn();
      mockReq.session.destroy = destroyMock;

      await authController.logout(mockReq, mockRes);

      expect(destroyMock).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({ sucesso: true });
    });
  });
}); 