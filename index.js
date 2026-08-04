// index.js — API de Tarefas (To-Do)
const express = require("express");
const cors = require("cors"); // 1. O require do cors vai no topo

const app = express();

// 2. Os Middlewares (JSON e CORS) vêm antes de qualquer rota
app.use(express.json());
app.use(cors({
  origin: 'https://matsuocn.github.io/Ajax02-Tabela/'
}));

// "Banco de dados" temporario (em memoria)
let tarefas = [
  { id: 1, titulo: "Estudar Node.js", concluida: false },
  { id: 2, titulo: "Criar API REST", concluida: false },
];
let proximoId = 3;

// GET /tarefas — Lista todas
app.get("/tarefas", (req, res) => {
  res.json(tarefas);
});

// GET /tarefas/:id — Busca uma por ID
app.get("/tarefas/:id", (req, res) => {
  const tarefa = tarefas.find(t => t.id === Number(req.params.id));
  if (!tarefa) return res.status(404).json({ erro: "Nao encontrada" });
  res.json(tarefa);
});

// POST /tarefas — Cria nova
app.post("/tarefas", (req, res) => {
  const nova = {
    id: proximoId++,
    titulo: req.body.titulo,
    concluida: false
  };
  tarefas.push(nova);
  res.status(201).json(nova);
});

// PUT /tarefas/:id — Atualiza
app.put("/tarefas/:id", (req, res) => {
  const tarefa = tarefas.find(t => t.id === Number(req.params.id));
  if (!tarefa) return res.status(404).json({ erro: "Nao encontrada" });
  tarefa.titulo = req.body.titulo || tarefa.titulo;
  tarefa.concluida = req.body.concluida ?? tarefa.concluida;
  res.json(tarefa);
});

// DELETE /tarefas/:id — Remove
app.delete("/tarefas/:id", (req, res) => {
  tarefas = tarefas.filter(t => t.id !== Number(req.params.id));
  res.status(204).send();
});

// Rota principal (raiz)
app.get("/", (req, res) => {
  res.send("API de Tarefas rodando! Acesse /tarefas para ver a lista.");
});

// 3. O listen fica por último
app.listen(3000, () => console.log("API rodando na porta 3000"));