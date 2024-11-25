const Invoice = require('../models/invoiceModel');
const { extractDataFromPdf } = require('../utils/pdfParser');
const { getCurrentInflationRate } = require('../utils/inflationApi');

// Upload e processamento de PDFs
exports.uploadPdf = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
  }

  const queries = req.files.map(async (file) => {
    const { originalname, buffer } = file;

    try {
      const extractedData = await extractDataFromPdf(buffer);

      if (!extractedData.invoiceNumber || !extractedData.invoiceDate || !extractedData.totalAmount) {
        throw new Error('Não foi possível extrair todos os dados necessários do PDF.');
      }

      // Insere os dados na tabela invoices
      await Invoice.create(extractedData);
    } catch (error) {
      throw error;
    }
  });

  try {
    await Promise.all(queries);
    res.json({ message: 'Dados dos PDFs salvos com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar os dados:', err);
    res.status(500).json({ message: 'Erro ao salvar os dados no banco de dados.' });
  }
};

// Obter despesas por mês
exports.getExpensesPerMonth = async (req, res) => {
  try {
    const results = await Invoice.getExpensesPerMonth();
    res.json(results);
  } catch (error) {
    console.error('Erro ao obter dados das despesas:', error);
    res.status(500).json({ message: 'Erro ao obter dados das despesas.' });
  }
};

exports.getFutureExpenses = async (req, res) => {
  try {
    // Obtém os dados históricos das faturas
    const historicalData = await Invoice.getExpensesPerMonth();

    // Obtém a taxa de inflação atual
    const inflationRate = await getCurrentInflationRate();
    console.log(`Taxa de inflação atual: ${(inflationRate * 100).toFixed(2)}%`);

    // Calcula as despesas futuras estimadas aplicando a inflação
    const futureExpenses = historicalData.map(item => {
      const estimatedExpense = item.total_expenses * (1 + inflationRate);
      return {
        month: item.month,
        originalExpense: item.total_expenses,
        estimatedExpense: parseFloat(estimatedExpense.toFixed(2)),
        consumption: item.total_consumption
      };
    });

    res.json({
      inflationRate: inflationRate,
      expenses: futureExpenses
    });
  } catch (error) {
    console.error('Erro ao obter despesas futuras:', error.message);
    res.status(500).json({ message: 'Erro ao obter despesas futuras.' });
  }
};