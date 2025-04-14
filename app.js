const express = require('express');
const session = require('express-session');
const path = require('path');

const authController = require('./controllers/authController');
const despesasController = require('./controllers/despesasController');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'chave-secreta',
  resave: false,
  saveUninitialized: false
}));

function autenticar(req, res, next) {
  if (!req.session.usuarioId) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }
  next();
}

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/app', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

app.post('/api/login', authController.login);
app.post('/api/register', authController.register);
app.post('/api/logout', authController.logout);

app.get('/api/despesas', autenticar, despesasController.listarDespesas);
app.post('/api/despesas', autenticar, despesasController.adicionarDespesa);
app.delete('/api/despesas/:id', autenticar, despesasController.excluirDespesa);

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
