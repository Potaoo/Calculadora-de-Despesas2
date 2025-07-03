const authController = require('../../controllers/authController');
const bcrypt = require('bcryptjs');
const usuarioModel = require('../../models/usuarioModel');

// Mock dos módulos
jest.mock('bcrypt');
jest.mock('../../models/usuarioModel');

describe('AuthController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      body: {},
      session: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('login', () => {
    test('deve fazer login com credenciais válidas', async () => {
      const usuario = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: 'senha_hash_123'
      };

      mockReq.body = {
        email: 'joao@email.com',
        senha: 'senha123'
      };

      usuarioModel.buscarPorEmail.mockResolvedValue(usuario);
      bcrypt.compare.mockResolvedValue(true);

      await authController.login(mockReq, mockRes);

      expect(usuarioModel.buscarPorEmail).toHaveBeenCalledWith('joao@email.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('senha123', 'senha_hash_123');
      expect(mockReq.session.usuarioId).toBe(1);
      expect(mockRes.json).toHaveBeenCalledWith({ sucesso: true });
    });

    test('deve retornar erro com credenciais inválidas', async () => {
      mockReq.body = {
        email: 'joao@email.com',
        senha: 'senha_errada'
      };

      usuarioModel.buscarPorEmail.mockResolvedValue(null);

      await authController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Credenciais inválidas' });
    });

    test('deve retornar erro com senha incorreta', async () => {
      const usuario = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: 'senha_hash_123'
      };

      mockReq.body = {
        email: 'joao@email.com',
        senha: 'senha_errada'
      };

      usuarioModel.buscarPorEmail.mockResolvedValue(usuario);
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Credenciais inválidas' });
    });

    test('deve retornar erro quando email ou senha estão faltando', async () => {
      mockReq.body = {
        email: 'joao@email.com'
        // senha faltando
      };

      await authController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Email e senha são obrigatórios' });
    });

    test('deve retornar erro interno quando falhar na busca do usuário', async () => {
      mockReq.body = {
        email: 'joao@email.com',
        senha: 'senha123'
      };

      usuarioModel.buscarPorEmail.mockRejectedValue(new Error('Erro no banco'));

      await authController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' });
    });
  });

  describe('register', () => {
    test('deve registrar um novo usuário com sucesso', async () => {
      const senhaCriptografada = 'senha_hash_123';
      const usuarioId = 1;

      mockReq.body = {
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: 'senha123'
      };

      bcrypt.hash.mockResolvedValue(senhaCriptografada);
      usuarioModel.criarUsuario.mockResolvedValue(usuarioId);

      await authController.register(mockReq, mockRes);

      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      expect(usuarioModel.criarUsuario).toHaveBeenCalledWith(
        'João Silva',
        'joao@email.com',
        senhaCriptografada
      );
      expect(mockReq.session.usuarioId).toBe(usuarioId);
      expect(mockRes.json).toHaveBeenCalledWith({ sucesso: true });
    });

    test('deve retornar erro quando dados estão faltando', async () => {
      mockReq.body = {
        nome: 'João Silva'
        // email e senha faltando
      };

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Nome, email e senha são obrigatórios' });
    });

    test('deve retornar erro interno quando falhar na criptografia', async () => {
      mockReq.body = {
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: 'senha123'
      };

      bcrypt.hash.mockRejectedValue(new Error('Erro na criptografia'));

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' });
    });

    test('deve retornar erro interno quando falhar na criação do usuário', async () => {
      const senhaCriptografada = 'senha_hash_123';

      mockReq.body = {
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: 'senha123'
      };

      bcrypt.hash.mockResolvedValue(senhaCriptografada);
      usuarioModel.criarUsuario.mockRejectedValue(new Error('Erro no banco'));

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' });
    });
  });

  describe('logout', () => {
    test('deve fazer logout com sucesso', async () => {
      mockReq.session.destroy = jest.fn();

      await authController.logout(mockReq, mockRes);

      expect(mockReq.session.destroy).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({ sucesso: true });
    });

    test('deve retornar erro interno quando falhar no logout', async () => {
      mockReq.session.destroy = jest.fn().mockImplementation(() => {
        throw new Error('Erro no logout');
      });

      await authController.logout(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' });
    });
  });
}); 