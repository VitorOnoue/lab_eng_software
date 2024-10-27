const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NotaFiscal = sequelize.define('NotaFiscal', {
  companhia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataEmissao: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  consumo: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  valorTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = NotaFiscal;
