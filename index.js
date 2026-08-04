const express = require("express");
const cors = require("cors");

const app = express();


app.use(express.json());
app.use(cors({
  origin: 'https://matsuocn.github.io/Ajax02-Tabela/'
}));


let tarefas = [
  { id: 1, titulo: "Estudar Node.js", concluida: false },
  { id: 2, titulo: "Criar API REST", concluida: false },
];
let proximoId = 3;


app.get("/tarefas", (req, res) => {
  res.json(tarefas);
});


app.get("/tarefas/:id", (req, res) => {
  const tarefa = tarefas.find(t => t.id === Number(req.params.id));
  if (!tarefa) return res.status(404).json({ erro: "Nao encontrada" });
  res.json(tarefa);
});


app.post("/tarefas", (req, res) => {
  const nova = {
    id: proximoId++,
    titulo: req.body.titulo,
    concluida: false
  };
  tarefas.push(nova);
  res.status(201).json(nova);
});


app.put("/tarefas/:id", (req, res) => {
  const tarefa = tarefas.find(t => t.id === Number(req.params.id));
  if (!tarefa) return res.status(404).json({ erro: "Nao encontrada" });
  tarefa.titulo = req.body.titulo || tarefa.titulo;
  tarefa.concluida = req.body.concluida ?? tarefa.concluida;
  res.json(tarefa);
});


app.delete("/tarefas/:id", (req, res) => {
  tarefas = tarefas.filter(t => t.id !== Number(req.params.id));
  res.status(204).send();
});


app.get("/", (req, res) => {
  res.send("API de Tarefas rodando!  .");
});


app.listen(3000, () => console.log("API rodando na porta 3000"));