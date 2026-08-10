require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Importa o modelo do banco de dados
const Tarefa = require("./database");

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'https://matsuocn.github.io/Ajax02-Tabela/'
}));

const segredo = process.env.JWT_SECRET || "segredo_temporario";
let usuarios = [];

// Middleware de Autenticação
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ erro: "Token não fornecido" });

  const token = authHeader.split(' ')[1];
  try {
    const dados = jwt.verify(token, segredo);
    req.usuario = dados;
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido" });
  }
}

// --- ROTAS DA API ---

app.get("/", (req, res) => {
  res.send("API de Tarefas rodando! 🚀");
});

// Autenticação
app.post('/registro', async (req, res) => {
  const { email, senha } = req.body;
  const hash = await bcrypt.hash(senha, 10);
  usuarios.push({ email, senha: hash });
  res.status(201).json({ message: "Usuário registrado com sucesso!" });
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) return res.status(401).json({ message: "Usuário não encontrado" });

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) return res.status(401).json({ message: "Senha incorreta" });

  const token = jwt.sign({ email }, segredo, { expiresIn: "1h" });
  res.json({ token });
});

app.get("/perfil", autenticarToken, (req, res) => {
  res.json({ mensagem: `Olá, ${req.usuario.email}` });
});

// Tarefas (Integradas ao MongoDB)
app.get("/tarefas", async (req, res) => {
  try {
    const tarefas = await Tarefa.find();
    res.json(tarefas);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar tarefas" });
  }
});

app.get("/tarefas/:id", async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id);
    if (!tarefa) return res.status(404).json({ erro: "Não encontrada" });
    res.json(tarefa);
  } catch {
    res.status(400).json({ erro: "ID inválido" });
  }
});

app.post("/tarefas", async (req, res) => {
  try {
    const novaTarefa = await Tarefa.create({ titulo: req.body.titulo });
    res.status(201).json(novaTarefa);
  } catch (err) {
    res.status(400).json({ erro: "Erro ao criar tarefa" });
  }
});

app.put("/tarefas/:id", async (req, res) => {
  try {
    const tarefa = await Tarefa.findByIdAndUpdate(
      req.params.id,
      { titulo: req.body.titulo, concluida: req.body.concluida },
      { new: true }
    );
    if (!tarefa) return res.status(404).json({ erro: "Não encontrada" });
    res.json(tarefa);
  } catch {
    res.status(400).json({ erro: "Erro ao atualizar" });
  }
});

app.delete("/tarefas/:id", async (req, res) => {
  try {
    await Tarefa.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch {
    res.status(400).json({ erro: "Erro ao deletar" });
  }
});

// Porta dinâmica necessária para o Render funcionar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));