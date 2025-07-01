# Calculadora de Despesas 💰

Este projeto é uma **Calculadora de Despesas** desenvolvida em **Node.js** com **Express**, utilizando o padrão de arquitetura **MVC**. Ela permite que o usuário registre, visualize e exclua despesas, com autenticação de login e registro de novos usuários.

## 🧑‍💻 Desenvolvedores
- **Nome**: Caio Eduardo de Lima Domingues / Thales Morigi Rodrigues Neves / Lucas Antônio Santanelli Pimenta / Bruno Espósito  
- **Faculdade**: Libertas Faculdades Integradas  
- **GitHub**: [@Potaoo](https://github.com/Potaoo) / [@Thalesmrn](https://github.com/Thalesmrn) / [@Lucasspimenta](https://github.com/Lucasspimenta) / [@brunoesposito3012](https://github.com/brunoesposito3012)

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- MySQL
- Bootstrap 5
- HTML/CSS/JS
- bcrypt (criptografia de senha)
- express-session
- Jest (testes unitários e integração)
- Supertest (testes de API)
- Codecov (cobertura de código)

## 🧭 Estrutura do Projeto (MVC)

- `models/` → Lógica de acesso ao banco de dados (usuários, despesas)  
- `controllers/` → Lógica de negócio e manipulação das requisições  
- `views/` → Interfaces HTML (Login e Dashboard de despesas)  
- `public/` → Arquivos públicos como CSS
- `tests/` → Testes unitários e de integração

## 🔐 Funcionalidades

- Registro de usuários com senha criptografada
- Login com sessão autenticada
- Adição de novas despesas
- Listagem de despesas por usuário
- Exclusão de despesas
- Cálculo automático do total de gastos
- Logout

## 📁 Como Rodar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/Potaoo/Calculadora-de-Despesas.git
   cd Calculadora-de-Despesas
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados MySQL (crie as tabelas de usuários e despesas).
```sql
CREATE DATABASE calculadora_despesas

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

4. Inicie o servidor:
   ```bash
   npm start
   ```

5. Acesse no navegador:
   ```
   http://localhost:3000
   ```

## 🧪 Testes

O projeto inclui uma suíte completa de testes com **20 testes unitários e de integração**:

### Executar Testes
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

### Estrutura dos Testes
- `tests/unit/` - Testes unitários para modelos e controladores
- `tests/integration/` - Testes de integração para APIs
- `tests/mocks/` - Mocks para dependências externas
- `tests/setup.js` - Configuração global dos testes

### Cobertura de Código
Os testes visam atingir pelo menos **80% de cobertura** de código, incluindo:
- Linhas de código
- Branches (condicionais)
- Funções
- Statements

## 📊 Codecov

O projeto está configurado para integração com o **Codecov** para monitoramento de cobertura de código.

### Configuração do Codecov

1. Acesse [codecov.io](https://codecov.io) e conecte seu repositório
2. Copie o token fornecido pelo Codecov
3. No GitHub, vá para Settings > Secrets and variables > Actions
4. Adicione um novo secret chamado `CODECOV_TOKEN` com o valor do token
5. O workflow do GitHub Actions irá automaticamente enviar os relatórios de cobertura

### Workflow do GitHub Actions
O projeto inclui um workflow automatizado que:
- Executa testes em múltiplas versões do Node.js
- Gera relatórios de cobertura
- Envia dados para o Codecov
- Falha se a cobertura estiver abaixo do limite configurado

## 🧠 Observações

- O projeto utiliza `express-session` para manter o usuário autenticado entre as requisições.
- O sistema só permite acesso às rotas de despesas se o usuário estiver autenticado.
- O frontend é responsivo e utiliza Bootstrap 5 para melhor visualização em dispositivos móveis.
- Todos os testes são executados automaticamente em cada push e pull request.
- A cobertura de código é monitorada e reportada pelo Codecov.

