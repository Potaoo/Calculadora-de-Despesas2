# Testes da Calculadora de Despesas

Este diretório contém todos os testes unitários e de integração da aplicação.

## Estrutura dos Testes

- `unit/` - Testes unitários para funções individuais
- `integration/` - Testes de integração para APIs e banco de dados
- `setup.js` - Configuração global dos testes

## Como Executar os Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes para CI/CD
npm run test:ci
```

## Configuração do Codecov

1. Acesse [codecov.io](https://codecov.io) e conecte seu repositório
2. Copie o token fornecido pelo Codecov
3. No GitHub, vá para Settings > Secrets and variables > Actions
4. Adicione um novo secret chamado `CODECOV_TOKEN` com o valor do token
5. O workflow do GitHub Actions irá automaticamente enviar os relatórios de cobertura

## Cobertura de Código

Os testes visam atingir pelo menos 80% de cobertura de código, incluindo:
- Linhas de código
- Branches (condicionais)
- Funções
- Statements

## Tipos de Testes

### Testes Unitários
- Testam funções individuais isoladamente
- Usam mocks para dependências externas
- Focam em lógica de negócio específica

### Testes de Integração
- Testam a integração entre componentes
- Incluem testes de API com supertest
- Testam interações com banco de dados 