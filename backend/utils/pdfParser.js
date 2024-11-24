// backend/utils/pdfParser.js

const pdf = require("pdf-parse");

async function extractDataFromPdf(pdfBuffer) {
  const data = await pdf(pdfBuffer);
  const text = data.text;
  console.log(text);
debugger;
  const invoiceNumber = extractInvoiceNumber(text);
  console.log("começando customer");
  const customerName = extractCustomerName(text);
  console.log("passou daqui");
  const invoiceDateRaw = extractInvoiceDate(text);
  const dueDateRaw = extractDueDate(text);
  const totalAmount = extractTotalAmount(text);
  const consumption = extractConsumption(text);
  const energyOperator = extractEnergyOperator(text);
  const taxes = extractTaxes(text);
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
  };
}

// Funções auxiliares para extração de dados
function formatDateToMySQL(dateString) {
  if (!dateString) return null;
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

function extractInvoiceNumber(text) {
  const match = text.match(/Nº\s*(\d+)/i);
  return match ? match[1] : null;
}

function extractCustomerName(text) {
  // MEXER
  const lines = text.split("\n");
  for (const line of lines) {
    const lineTrim = line.trim();
    if (/^[A-ZÀ-Ú\s]+$/.test(lineTrim)) {
      return lineTrim;
    }
  }
  // const match = text.split("\n")[0];
  // // const match = text.match(/Nome do Cliente:\s*(.+)/i);
  // return match ? match[1].trim() : null;
  return null;
}

function extractInvoiceDate(text) {
  const match = text.match(/\b\d{2}\/\d{2}\/\d{4}\b/g);
  return match ? match[2] : null;
}

function extractDueDate(text) {
  const match = text.match(/\b\d{2}\/\d{2}\/\d{4}\b/g);
  return match ? match[0] : null;
}

function extractTotalAmount(text) {
  const match = text.match(/R\$\d{1,3}(?:\.\d{3})*,\d{2}/);
  return parseFloat(match[1].replace(/\./g, "").replace(",", "."));
}

function extractConsumption(text) {
  const match = text.match(/Consumo \(kWh\):\s*([\d\.,]+)/i);
  if (!match) return null;
  return parseFloat(match[1].replace(/\./g, "").replace(",", "."));
}

function extractEnergyOperator(text) {
  return "Enel-SP";
}

function extractTaxes(text) {
  const line = text.split("\n").find(line => line.includes("TOTAL"));
  const values = line ? line.match(/\d+, \d{2}/g) : [];
  return values;
}

module.exports = {
  extractDataFromPdf,
};
