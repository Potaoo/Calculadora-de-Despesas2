const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const { createAuthenticatedAgent, cleanupTestData } = require('./testHelper');

describe('Despesas - Testes de Integração', () => {
  let authenticatedAgent;

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await db.query('DELETE FROM despesas');
    await db.query('DELETE FROM usuarios');
    
    // Criar agente autenticado
    authenticatedAgent = await createAuthenticatedAgent();
  });

  describe('GET /api/despesas', () => {
    test('deve listar despesas do usuário autenticado', async () => {
      const response = await authenticatedAgent
        .get('/api/despesas')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('deve retornar array vazio quando não há despesas', async () => {
      const response = await authenticatedAgent
        .get('/api/despesas')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    test('deve bloquear acesso sem autenticação', async () => {
      const response = await request(app)
        .get('/api/despesas')
        .expect(401);

      expect(response.body).toEqual({ erro: 'Não autenticado' });
    });
  });

  describe('POST /api/despesas', () => {
    test('deve adicionar uma nova despesa com sucesso', async () => {
      const novaDespesa = {
        descricao: 'Almoço de Teste',
        valor: 25.50
      };

      const response = await authenticatedAgent
        .post('/api/despesas')
        .send(novaDespesa)
        .expect(201);

      expect(response.body).toEqual({ sucesso: true });
    });

    test('deve adicionar despesa com valor decimal', async () => {
      const novaDespesa = {
        descricao: 'Transporte',
        valor: 5.75
      };

      const response = await authenticatedAgent
        .post('/api/despesas')
        .send(novaDespesa)
        .expect(201);

      expect(response.body).toEqual({ sucesso: true });
    });

    test('deve retornar erro com dados inválidos - descrição faltando', async () => {
      const despesaInvalida = {
        valor: 25.50
      };

      const response = await authenticatedAgent
        .post('/api/despesas')
        .send(despesaInvalida)
        .expect(400);

      expect(response.body).toHaveProperty('erro');
    });

    test('deve retornar erro com dados inválidos - valor faltando', async () => {
      const despesaInvalida = {
        descricao: 'Almoço'
      };

      const response = await authenticatedAgent
        .post('/api/despesas')
        .send(despesaInvalida)
        .expect(400);

      expect(response.body).toHaveProperty('erro');
    });

    test('deve bloquear acesso sem autenticação', async () => {
      const novaDespesa = {
        descricao: 'Almoço',
        valor: 25.50
      };

      const response = await request(app)
        .post('/api/despesas')
        .send(novaDespesa)
        .expect(401);

      expect(response.body).toEqual({ erro: 'Não autenticado' });
    });

    test('deve persistir despesa no banco de dados', async () => {
      const novaDespesa = {
        descricao: 'Despesa Persistente',
        valor: 30.00
      };

      await authenticatedAgent
        .post('/api/despesas')
        .send(novaDespesa)
        .expect(201);

      // Verificar se a despesa foi salva
      const response = await authenticatedAgent
        .get('/api/despesas')
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      const despesaSalva = response.body.find(d => d.descricao === novaDespesa.descricao);
      expect(despesaSalva).toBeDefined();
      expect(despesaSalva.valor).toBe(novaDespesa.valor);
    });
  });

  describe('DELETE /api/despesas/:id', () => {
    let despesaId;

    beforeEach(async () => {
      // Criar uma despesa para testar exclusão
      const novaDespesa = {
        descricao: 'Despesa para Excluir',
        valor: 15.00
      };

      await authenticatedAgent
        .post('/api/despesas')
        .send(novaDespesa);

      // Obter o ID da despesa criada
      const response = await authenticatedAgent.get('/api/despesas');
      expect(response.body.length).toBeGreaterThan(0);
      despesaId = response.body[0].id;
    });

    test('deve excluir uma despesa com sucesso', async () => {
      const response = await authenticatedAgent
        .delete(`/api/despesas/${despesaId}`)
        .expect(200);

      expect(response.body).toEqual({ sucesso: true });
    });

    test('deve remover despesa do banco de dados', async () => {
      await authenticatedAgent
        .delete(`/api/despesas/${despesaId}`)
        .expect(200);

      // Verificar se a despesa foi removida
      const response = await authenticatedAgent
        .get('/api/despesas')
        .expect(200);

      const despesaRemovida = response.body.find(d => d.id === despesaId);
      expect(despesaRemovida).toBeUndefined();
    });

    test('deve bloquear acesso sem autenticação', async () => {
      const response = await request(app)
        .delete(`/api/despesas/${despesaId}`)
        .expect(401);

      expect(response.body).toEqual({ erro: 'Não autenticado' });
    });

    test('deve retornar erro ao tentar excluir despesa inexistente', async () => {
      const idInexistente = 99999;

      const response = await authenticatedAgent
        .delete(`/api/despesas/${idInexistente}`)
        .expect(404);

      expect(response.body).toHaveProperty('erro');
    });

    test('deve verificar se despesa pertence ao usuário', async () => {
      // Criar outro usuário
      const segundoAgent = await createAuthenticatedAgent('segundo@email.com', 'senha123');
      
      // Tentar excluir despesa de outro usuário
      const response = await segundoAgent
        .delete(`/api/despesas/${despesaId}`)
        .expect(404);

      expect(response.body).toHaveProperty('erro');
    });
  });

  describe('Fluxo Completo de Despesas', () => {
    test('deve permitir ciclo completo: adicionar, listar e excluir despesa', async () => {
      // 1. Adicionar despesa
      const novaDespesa = {
        descricao: 'Despesa Completa',
        valor: 50.00
      };

      await authenticatedAgent
        .post('/api/despesas')
        .send(novaDespesa)
        .expect(201);

      // 2. Listar despesas
      const listResponse = await authenticatedAgent
        .get('/api/despesas')
        .expect(200);

      expect(listResponse.body.length).toBeGreaterThan(0);
      const despesaCriada = listResponse.body.find(d => d.descricao === novaDespesa.descricao);
      expect(despesaCriada).toBeDefined();

      // 3. Excluir despesa
      await authenticatedAgent
        .delete(`/api/despesas/${despesaCriada.id}`)
        .expect(200);

      // 4. Verificar se foi removida
      const finalResponse = await authenticatedAgent
        .get('/api/despesas')
        .expect(200);

      const despesaRemovida = finalResponse.body.find(d => d.id === despesaCriada.id);
      expect(despesaRemovida).toBeUndefined();
    });

    test('deve manter isolamento entre usuários', async () => {
      // Criar despesa para primeiro usuário
      const despesa1 = {
        descricao: 'Despesa Usuário 1',
        valor: 25.00
      };

      await authenticatedAgent
        .post('/api/despesas')
        .send(despesa1)
        .expect(201);

      // Criar segundo usuário
      const segundoAgent = await createAuthenticatedAgent('segundo@email.com', 'senha123');
      
      // Criar despesa para segundo usuário
      const despesa2 = {
        descricao: 'Despesa Usuário 2',
        valor: 30.00
      };

      await segundoAgent
        .post('/api/despesas')
        .send(despesa2)
        .expect(201);

      // Verificar isolamento
      const response1 = await authenticatedAgent.get('/api/despesas');
      const response2 = await segundoAgent.get('/api/despesas');

      expect(response1.body.length).toBe(1);
      expect(response2.body.length).toBe(1);
      expect(response1.body[0].descricao).toBe(despesa1.descricao);
      expect(response2.body[0].descricao).toBe(despesa2.descricao);
    });
  });
}); 