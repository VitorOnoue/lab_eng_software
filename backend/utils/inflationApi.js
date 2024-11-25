// backend/utils/inflationApi.js

const axios = require('axios');

// URL da API do Banco Central para o IPCA
const INFLATION_API_URL = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json';

async function getCurrentInflationRate() {
  try {
    const response = await axios.get(INFLATION_API_URL);
    const data = response.data[0];
    const inflationRate = parseFloat(data.valor.replace(',', '.')) / 100;
    return inflationRate; // Retorna a taxa como decimal (por exemplo, 0.0023 para 0.23%)
  } catch (error) {
    console.error('Erro ao obter taxa de inflação:', error.message);
    throw error;
  }
}

module.exports = {
  getCurrentInflationRate
};
