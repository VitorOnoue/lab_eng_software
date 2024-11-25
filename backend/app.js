// backend/app.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth"); // Importa as rotas de autenticação
const invoiceRoutes = require("./routes/invoices"); // Importa as rotas de faturas

const app = express();
const PORT = 3000;

// Configuração do body-parser e CORS
app.use(cors());
app.use(bodyParser.json());

// Usa as rotas de autenticação e faturas
app.use("/api", authRoutes);
app.use("/api", invoiceRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
