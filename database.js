const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Conectado ao MongoDB"))
.catch((err) => console.error("Erro", err));

const tarefaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  concluida: { type: Boolean, default: false }
});

const Tarefa = mongoose.model("Tarefa", tarefaSchema);
module.exports = Tarefa;

const Tarefa = require("./database");

app.get("/tarefas", async (req, res) => {
    const tarefas = await Tarefa.find();
    res.json(tarefas);
});

app.post("/tarefas", async (req, res) => {
    const novaTarefa = await Tarefa.create({ titulo: req.body.titulo });
    res.status(201).json(novaTarefa);
});

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SEGREDO = process.env.JWT_SECRET || "segredd-temporario";

let usuarios = [];
app.post("/usuarios", async (req, res) => {
    const { email, senha } = req.body;
    const hash = await bcrypt.hash(senha, 10);
    usuarios.push({ email, senha: hash });
    res.status(201).json({mensagem: "Usuário criado com sucesso"});
});

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) return res.status(401).json({ erro: "Email Inválido" });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ erro: "Senha Inválida" });

    const token = jwt.sign({ email }, SEGREDO, { expiresIn: "1h" });
    res.json({ token });
});

function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ erro: "Token ausente" });

    const token = authHeader.split(" ")[1]; // Remove "Bearer " prefix
    try {
        const dados = jwt.verify(token, SEGREDO);
        req.usuario = dados;
        next();
    } catch (err) {
        return res.status(401).json({ erro: "Token inválido" });
    }

    app.get("/perfil", autenticar, (req, res) => {
        res.json({ email: req.usuario.email });
    });

    
