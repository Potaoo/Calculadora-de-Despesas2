# Configuração do Ambiente de Testes

## Pré-requisitos

1. **Node.js** (versão 16 ou superior)
2. **MySQL** (versão 5.7 ou superior)
3. **Git**

## Configuração Inicial

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
Execute os seguintes comandos SQL no seu MySQL:

```sql
CREATE DATABASE calculadora_despesas;

USE calculadora_despesas;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  senha VARCHAR(255)
);

CREATE TABLE despesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  descricao VARCHAR(255),
  valor DECIMAL(10,2),
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=calculadora_despesas

# Configurações da Sessão
SESSION_SECRET=sua_chave_secreta_aqui

# Token do Codecov (adicione seu token aqui)
CODECOV_TOKEN=seu_token_do_codecov_aqui

# Configurações do Servidor
PORT=3000
NODE_ENV=development
```

## Executando os Testes

### No Windows (PowerShell)
Se você encontrar problemas de execução de scripts, execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Comandos de Teste
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

## Estrutura dos Testes

### Testes Unitários (12 testes)
- **usuarioModel.test.js** (6 testes)
  - Testa criação de usuários
  - Testa busca por email
  - Testa tratamento de erros

- **despesaModel.test.js** (6 testes)
  - Testa listagem de despesas
  - Testa adição de despesas
  - Testa exclusão de despesas

### Testes de Integração (8 testes)
- **auth.test.js** (8 testes)
  - Testa registro de usuários
  - Testa login/logout
  - Testa middleware de autenticação

- **despesas.test.js** (12 testes)
  - Testa CRUD de despesas
  - Testa isolamento entre usuários
  - Testa fluxos completos

## Configuração do Codecov

### 1. Conectar Repositório
1. Acesse [codecov.io](https://codecov.io)
2. Faça login com sua conta GitHub
3. Adicione seu repositório

### 2. Configurar Token
1. No GitHub, vá para seu repositório
2. Settings > Secrets and variables > Actions
3. Adicione um novo secret:
   - Nome: `CODECOV_TOKEN`
   - Valor: Token fornecido pelo Codecov

### 3. Verificar Workflow
O arquivo `.github/workflows/test.yml` já está configurado para:
- Executar testes em múltiplas versões do Node.js
- Gerar relatórios de cobertura
- Enviar dados para o Codecov

## Troubleshooting

### Problemas Comuns

1. **Erro de execução de scripts no PowerShell**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Erro de conexão com banco de dados**
   - Verifique se o MySQL está rodando
   - Confirme as credenciais no arquivo `db.js`
   - Verifique se o banco `calculadora_despesas` existe

3. **Testes falhando**
   - Verifique se todas as dependências foram instaladas
   - Confirme se o banco de dados está configurado
   - Verifique se não há outros processos usando a porta 3000

4. **Cobertura baixa**
   - Execute `npm run test:coverage` para ver detalhes
   - Verifique se todos os arquivos estão sendo testados
   - Confirme se os mocks estão funcionando corretamente

## Relatórios de Cobertura

Após executar `npm run test:coverage`, você encontrará:

- **Relatório HTML**: `coverage/index.html`
- **Relatório LCOV**: `coverage/lcov.info`
- **Relatório no terminal**: Resumo da cobertura

## Metas de Cobertura

- **Linhas**: 80%
- **Branches**: 80%
- **Funções**: 80%
- **Statements**: 80%

## Próximos Passos

1. Execute os testes para verificar se tudo está funcionando
2. Configure o Codecov seguindo as instruções acima
3. Faça push do código para o GitHub
4. Verifique se o workflow do GitHub Actions está funcionando
5. Monitore a cobertura no Codecov 