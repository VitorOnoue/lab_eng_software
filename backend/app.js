const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db'); // Importa a configuração do banco de dados
const authRoutes = require('./routes/auth'); // Importa as rotas de autenticação
const multer = require('multer');
const pdf = require('pdf-parse'); // Importa a biblioteca para ler PDFs

const app = express();
const PORT = 3000;

// Configuração do body-parser e CORS
app.use(cors());
app.use(bodyParser.json());

// Usa as rotas de autenticação
app.use('/api', authRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Configuração do multer para armazenar PDFs em memória
const storage = multer.memoryStorage(); // Armazenamento em memória
const upload = multer({ storage });

app.get('/api/hello-world', async (req, res) => {
    return res.status(200).json({message: "GOL"});
});

// Rota para upload de PDF e processamento
app.post('/api/upload-pdf', upload.array('pdfs'), async (req, res) => {
    console.log('Rota de upload chamada');
    if (!req.files || req.files.length === 0) {
        console.log('Nenhum arquivo enviado');
        return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
    }

    const queries = req.files.map(async (file) => {
        const { originalname, buffer } = file;
        console.log(`Processando PDF: ${originalname}`);

        try {
            const extractedData = await extractDataFromPdf(buffer);
            console.log(`Dados extraídos do PDF:`, extractedData);

            if (extractedData.invoiceValue === null || extractedData.invoiceDate === null) {
                console.error('Dados incompletos extraídos do PDF.');
                throw new Error('Não foi possível extrair todos os dados necessários do PDF.');
            }

            const query = 'INSERT INTO pdf_files (filename) VALUES (?)';
            const result = await new Promise((resolve, reject) => {
                db.query(query, [originalname], (err, results) => {
                    if (err) {
                        console.error('Erro ao inserir PDF:', err);
                        return reject(err);
                    }
                    resolve(results);
                });
            });

            const pdfId = result.insertId; // ID do PDF inserido

            const dataQuery = 'INSERT INTO pdf_data (pdf_id, invoice_value, invoice_date) VALUES (?, ?, ?)';
            await new Promise((resolve, reject) => {
                db.query(dataQuery, [pdfId, extractedData.invoiceValue, extractedData.invoiceDate], (err) => {
                    if (err) {
                        console.error('Erro ao inserir dados do PDF:', err);
                        return reject(err);
                    }
                    resolve();
                });
            });

            console.log(`Dados do PDF ${originalname} salvos com sucesso!`);
        } catch (error) {
            console.error('Erro ao processar o PDF:', error.message);
            throw error; // Propaga o erro para ser capturado pelo Promise.all
        }
    });

    // Aguarda a conclusão de todas as promessas
    try {
        await Promise.all(queries);
        res.json({ message: 'PDFs e dados salvos com sucesso!' });
    } catch (err) {
        console.error('Erro ao salvar os PDFs ou dados no banco de dados:', err);
        res.status(500).json({ message: 'Erro ao salvar os PDFs ou dados no banco de dados.' });
    }
});


// **Adicionando o endpoint /api/expenses-per-month**
app.get('/api/expenses-per-month', async (req, res) => {
    try {
        const query = `
            SELECT 
                DATE_FORMAT(invoice_date, '%Y-%m') as month,
                SUM(invoice_value) as total_expenses
            FROM pdf_data
            GROUP BY month
            ORDER BY month;
        `;
        const results = await new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Erro ao consultar dados:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });
        res.json(results);
    } catch (error) {
        console.error('Erro ao obter dados das despesas:', error);
        res.status(500).json({ message: 'Erro ao obter dados das despesas.' });
    }
});


// Função de extração de dados do PDF
async function extractDataFromPdf(pdfBuffer) {
    const data = await pdf(pdfBuffer);
    const text = data.text;

    console.log('--- Texto extraído do PDF ---\n', text);

    const invoiceValue = extractInvoiceValue(text);
    const invoiceDateRaw = extractInvoiceDate(text);
    const invoiceDate = formatDateToMySQL(invoiceDateRaw);

    console.log('Valor da fatura extraído:', invoiceValue);
    console.log('Data da fatura extraída (bruta):', invoiceDateRaw);
    console.log('Data da fatura formatada:', invoiceDate);

    return { invoiceValue, invoiceDate };
}

// Função para converter a data para o formato MySQL 'YYYY-MM-DD'
function formatDateToMySQL(dateString) {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}

// Função para extrair o valor da fatura
function extractInvoiceValue(text) {
    const valueMatch = text.match(/Valor da Fatura:\s*R?\$?\s*([\d\.,]+)/i);
    if (!valueMatch) {
        console.error('Valor da fatura não encontrado no texto.');
        return null;
    }
    const valueString = valueMatch[1].replace(/\./g, '').replace(',', '.');
    return parseFloat(valueString);
}

// Função para extrair a data da fatura
function extractInvoiceDate(text) {
    const dateMatch = text.match(/Data da Fatura:\s*(\d{2}\/\d{2}\/\d{4})/i);
    if (!dateMatch) {
        console.error('Data da fatura não encontrada no texto.');
        return null;
    }
    return dateMatch[1];
}
