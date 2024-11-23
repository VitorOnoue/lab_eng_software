// backend/routes/invoices.js

const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const multer = require('multer');

// Configuração do multer para armazenar PDFs em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Rota para upload de PDFs
router.post('/upload-pdf', upload.array('pdfs'), invoiceController.uploadPdf);

// Rota para obter despesas por mês
router.get('/expenses-per-month', invoiceController.getExpensesPerMonth);

module.exports = router;
