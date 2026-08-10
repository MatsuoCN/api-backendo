const mongoose = require("mongoose");

// Usa a mesma variável definida no index.js ou no painel do Render
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ ERRO CRÍTICO: A variável de ambiente do MongoDB não foi configurada!");
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Conectado ao MongoDB com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar no MongoDB:", err));

const tarefaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  concluida: { type: Boolean, default: false }
});

const Tarefa = mongoose.model("Tarefa", tarefaSchema);

module.exports = Tarefa;