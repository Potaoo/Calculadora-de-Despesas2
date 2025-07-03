const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const { cleanupTestData, testData } = require('./testHelper');

describe('Autenticação - Testes de Integração', () => {
  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await db.query('DELETE FROM despesas');
    await db.query('DELETE FROM usuarios');
  });

  describe('POST /api/register', () => {
    test('deve registrar um novo usuário com sucesso', async () => {
      const response = await request(app)
        .post('/api/register')
        .send(testData.usuario)
        .expect(200);

      expect(response.body).toEqual({ sucesso: true });
    });

    test('deve retornar erro com dados inválidos - email faltando', async () => {
      const dadosInvalidos = {
        nome: 'Usuário Teste',
        senha: 'senha123'
      };

      const response = await request(app)
        .post('/api/register')
        .send(dadosInvalidos)
        .expect(400);

      expect(response.body).toHaveProperty('erro');
    });

    test('deve retornar erro com dados inválidos - senha faltando', async () => {
      const dadosInvalidos = {
        nome: 'Usuário Teste',
        email: 'test2@email.com'
      };

      const response = await request(app)
        .post('/api/register')
        .send(dadosInvalidos)
        .expect(400);

      expect(response.body).toHaveProperty('erro');
    });

    test('deve criar sessão após registro bem-sucedido', async () => {
      const agent = request.agent(app);
      
      await agent
        .post('/api/register')
        .send({
          nome: 'Usuário Sessão',
          email: 'sessao@email.com',
          senha: 'senha123'
        })
        .expect(200);

      // Verificar se a sessão foi criada tentando acessar rota protegida
      const response = await agent
        .get('/api/despesas')
        .expect(200); // Deve funcionar se a sessão foi criada
    });
  });

  describe('POST /api/login', () => {
    beforeEach(async () => {
      // Registrar um usuário para teste de login
      await request(app)
        .post('/api/register')
        .send({
          nome: 'Usuário Login',
          email: 'login@email.com',
          senha: 'senha123'
        });
    });

    test('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'login@email.com',
          senha: 'senha123'
        })
        .expect(200);

      expect(response.body).toEqual({ sucesso: true });
    });

    test('deve retornar erro com email inválido', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'inexistente@email.com',
          senha: 'senha123'
        })
        .expect(401);

      expect(response.body).toEqual({ erro: 'Credenciais inválidas' });
    });

    test('deve retornar erro com senha inválida', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'login@email.com',
          senha: 'senha_errada'
        })
        .expect(401);

      expect(response.body).toEqual({ erro: 'Credenciais inválidas' });
    });

    test('deve criar sessão após login bem-sucedido', async () => {
      const agent = request.agent(app);
      
      await agent
        .post('/api/login')
        .send({
          email: 'login@email.com',
          senha: 'senha123'
        })
        .expect(200);

      // Verificar se a sessão foi criada
      const response = await agent
        .get('/api/despesas')
        .expect(200);
    });
  });

  describe('POST /api/logout', () => {
    test('deve fazer logout com sucesso', async () => {
      const agent = request.agent(app);
      
      // Primeiro fazer login
      await agent
        .post('/api/register')
        .send({
          nome: 'Usuário Logout',
          email: 'logout@email.com',
          senha: 'senha123'
        });

      // Fazer logout
      const response = await agent
        .post('/api/logout')
        .expect(200);

      expect(response.body).toEqual({ sucesso: true });
    });

    test('deve destruir a sessão após logout', async () => {
      const agent = request.agent(app);
      
      // Primeiro fazer login
      await agent
        .post('/api/register')
        .send({
          nome: 'Usuário Sessão',
          email: 'sessao2@email.com',
          senha: 'senha123'
        });

      // Fazer logout
      await agent.post('/api/logout');

      // Tentar acessar rota protegida deve falhar
      await agent
        .get('/api/despesas')
        .expect(401);
    });
  });

  describe('Middleware de Autenticação', () => {
    test('deve bloquear acesso a rotas protegidas sem autenticação', async () => {
      const response = await request(app)
        .get('/api/despesas')
        .expect(401);

      expect(response.body).toEqual({ erro: 'Não autenticado' });
    });

    test('deve permitir acesso a rotas protegidas com autenticação', async () => {
      const agent = request.agent(app);
      
      await agent
        .post('/api/register')
        .send({
          nome: 'Usuário Protegido',
          email: 'protegido@email.com',
          senha: 'senha123'
        });

      const response = await agent
        .get('/api/despesas')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
}); 