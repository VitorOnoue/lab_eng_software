// backend/utils/pdfParser.js

const pdf = require('pdf-parse');

async function extractDataFromPdf(pdfBuffer) {
  const data = await pdf(pdfBuffer);
  const text = data.text;

  const invoiceNumber = extractInvoiceNumber(text);
  const customerName = extractCustomerName(text);
  const invoiceDateRaw = extractInvoiceDate(text);
  const dueDateRaw = extractDueDate(text);
  const totalAmount = extractTotalAmount(text);
  const consumption = extractConsumption(text);
  const energyOperator = extractEnergyOperator(text);
  const taxes = extractTaxes(text);
  const otherCharges = extractOtherCharges(text);

  const invoiceDate = formatDateToMySQL(invoiceDateRaw);
  const dueDate = formatDateToMySQL(dueDateRaw);

  return {
    invoiceNumber,
    customerName,
    invoiceDate,
    dueDate,
    totalAmount,
    consumption,
    energyOperator,
    taxes,
    otherCharges
  };
}

// Funções auxiliares para extração de dados
function formatDateToMySQL(dateString) {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
}

function extractInvoiceNumber(text) {
  const match = text.match(/Número da Fatura:\s*(\d+)/i);
  return match ? match[1] : null;
}

function extractCustomerName(text) {
  const match = text.match(/Nome do Cliente:\s*(.+)/i);
  return match ? match[1].trim() : null;
}

function extractInvoiceDate(text) {
  const match = text.match(/Data da Fatura:\s*(\d{2}\/\d{2}\/\d{4})/i);
  return match ? match[1] : null;
}

function extractDueDate(text) {
  const match = text.match(/Data de Vencimento:\s*(\d{2}\/\d{2}\/\d{4})/i);
  return match ? match[1] : null;
}

function extractTotalAmount(text) {
  const match = text.match(/Valor Total:\s*R?\$?\s*([\d\.,]+)/i);
  if (!match) return null;
  return parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
}

function extractConsumption(text) {
  const match = text.match(/Consumo \(kWh\):\s*([\d\.,]+)/i);
  if (!match) return null;
  return parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
}

function extractEnergyOperator(text) {
  if (text.includes('Enel')) {
    return 'Enel';
  } else if (text.includes('OutraOperadora')) {
    return 'OutraOperadora';
  } else {
    return 'Desconhecida';
  }
}

function extractTaxes(text) {
  const match = text.match(/Total de Impostos:\s*R?\$?\s*([\d\.,]+)/i);
  if (!match) return null;
  return parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
}

function extractOtherCharges(text) {
  const match = text.match(/Outras Tarifas:\s*R?\$?\s*([\d\.,]+)/i);
  if (!match) return null;
  return parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
}

module.exports = {
  extractDataFromPdf
};
