const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Rota para upload de PDFs
router.post('/upload-pdf', upload.array('pdfs'), invoiceController.uploadPdf);
// Rota para obter despesas por mês
router.get('/expenses-per-month', invoiceController.getExpensesPerMonth);

module.exports = router;