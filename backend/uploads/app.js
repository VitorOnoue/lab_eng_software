const express = require('express');
const multer = require('multer');
const axios = require('axios');
const sequelize = require('./config/database');
const NotaFiscal = require('./models/NotaFiscal');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Sincroniza o modelo com o banco de dados
sequelize.sync();

// Configuração do Multer para upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
});
const upload = multer({ storage: storage });

// Rota para upload de arquivos
app.post('/upload', upload.single('notaFiscal'), async (req, res) => {
  try {
    // Envie o arquivo para a API de OCR
    const ocrResult = await enviarParaOCR(req.file.path);

    // Valide se é uma nota fiscal da Enel
    const isEnel = validarNotaEnel(ocrResult);

    if (!isEnel) {
      return res.status(400).json({ message: 'Nota fiscal inválida.' });
    }

    // Extraia os dados necessários
    const dadosNota = extrairDados(ocrResult);

    // Salve no banco de dados
    await NotaFiscal.create(dadosNota);

    res.json({ message: 'Nota fiscal processada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar a nota fiscal.' });
  }
});

// Função para enviar o arquivo para a API de OCR
async function enviarParaOCR(filePath) {
  const apiKey = process.env.OCR_API_KEY;
  // Exemplo de requisição usando Axios
  const response = await axios.post('URL_DA_API_DE_OCR', {
    apiKey: apiKey,
    filePath: filePath,
  });
  return response.data;
}

// Função para validar se a nota é da Enel
function validarNotaEnel(ocrData) {
  // Verifique se o nome "Enel" aparece nos dados extraídos
  return ocrData.includes('Enel');
}

// Função para extrair dados específicos da nota
function extrairDados(ocrData) {
  // Implemente a lógica para extrair data de emissão, consumo e valor total
  // Isso pode variar dependendo do formato dos dados retornados pela API de OCR
  return {
    companhia: 'Enel',
    dataEmissao: '2023-10-01', // Exemplo
    consumo: 150.5, // Exemplo
    valorTotal: 200.75, // Exemplo
  };
}

// Rota para obter o consumo mensal
app.get('/consumo-mensal', async (req, res) => {
  try {
    const dados = await NotaFiscal.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('dataEmissao')), 'mes'],
        [sequelize.fn('SUM', sequelize.col('consumo')), 'consumoTotal'],
      ],
      group: 'mes',
      order: [['mes', 'ASC']],
    });
    res.json(dados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter dados.' });
  }
});

app.listen(port, () => {
  console.log(Servidor rodando na porta ${port});
});
