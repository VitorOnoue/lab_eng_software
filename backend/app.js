const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/db"); // Importa a configuração do banco de dados
const authRoutes = require("./routes/auth"); // Importa as rotas de autenticação

const app = express();
const PORT = 3000;

// Configuração do body-parser e CORS
app.use(cors());
app.use(bodyParser.json());

// Usa as rotas de autenticação
app.use("/api", authRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// app.js
app.post("/api/upload-pdf", upload.array("pdfs"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      message: "Nenhum arquivo foi enviado."
    });
  }

  const queries = req.files.map(async (file) => {
    const {
      originalname,
      buffer
    } = file;

    try {
      console.log("antes do data");
      const extractedData = await extractDataFromPdf(buffer);
      console.log(extractedData.invoiceNumber);
      console.log(extractedData.customerName);
      console.log(extractedData.invoiceDate);
      console.log(extractedData.dueDate);
      console.log(extractedData.totalAmount);
      console.log(extractedData.energyOperator);

      if (
        !extractedData.invoiceNumber ||
        !extractedData.customerName ||
        !extractedData.invoiceDate ||
        !extractedData.dueDate ||
        !extractedData.totalAmount ||
        !extractedData.energyOperator
      ) {
        throw new Error(
          "Não foi possível extrair todos os dados necessários do PDF."
        );
      }
      // Insere os dados na tabela invoices
      const query = `
                INSERT INTO invoices (invoice_number, customer_name, invoice_date, due_date, total_amount, energy_operator, user_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
      // INSERT INTO invoices (invoice_number, customer_name, invoice_date, due_date, total_amount, consumption, energy_operator, taxes, other_charges)
      //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      await new Promise((resolve, reject) => {
        db.query(
          query,
          [
            extractedData.invoiceNumber,
            extractedData.customerName,
            extractedData.invoiceDate,
            extractedData.dueDate,
            extractedData.totalAmount,
            // extractedData.consumption,
            extractedData.energyOperator,
            // extractedData.taxes,
            14,
          ],
        );
      });
    } catch (error) {
      throw error;
    }
  });

  try {
    await Promise.all(queries);
    res.json({
      message: "Dados dos PDFs salvos com sucesso!"
    });
    const response = await fetch(`http://${apiurl}/api/expenses-per-month`, {
      headers: {},
    });
    const data = await response.json();

    if (response.ok) {
      renderChart(data);
    } else {
      console.error("Erro ao obter dados das despesas:", data.message);
    }
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Erro ao salvar os dados no banco de dados."
      });
  }
});

// **Adicionando o endpoint /api/expenses-per-month**
app.get("/api/expenses-per-month", async (req, res) => {
  try {
    const query = `
            SELECT 
                DATE_FORMAT(invoice_date, '%Y-%m') as month,
                SUM(total_amount) as total_expenses,
                SUM(consumption) as total_consumption
            FROM invoices
            WHERE user_id = 14
            GROUP BY month
            ORDER BY month;
        `;
    const results = await new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao obter dados das despesas."
    });
  }
});

// app.js
const {
  extractDataFromPdf
} = require("./utils/pdfParser"); // Mova as funções de extração para um módulo separado

// Função para converter a data para o formato MySQL 'YYYY-MM-DD'
function formatDateToMySQL(dateString) {
  if (!dateString) return null;
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

// Função para extrair o valor da fatura
function extractInvoiceValue(text) {
  const valueMatch = text.match(/Valor da Fatura:\s*R?\$?\s*([\d\.,]+)/i);
  if (!valueMatch) {
    console.error("Valor da fatura não encontrado no texto.");
    return null;
  }
  const valueString = valueMatch[1].replace(/\./g, "").replace(",", ".");
  return parseFloat(valueString);
}

// Função para extrair a data da fatura
function extractInvoiceDate(text) {
  const dateMatch = text.match(/Data da Fatura:\s*(\d{2}\/\d{2}\/\d{4})/i);
  if (!dateMatch) {
    console.error("Data da fatura não encontrada no texto.");
    return null;
  }
  return dateMatch[1];
}