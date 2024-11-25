const mysql = require('mysql2');

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'eng-db.c5mu0ekkaz0m.us-east-1.rds.amazonaws.com',
    user: 'admin', // usuário do MySQL
    password: 'engenhariasoftwaretaosso', // senha do MySQL
    database: 'engdb' // nome do banco de dados
});

// Conecta ao banco de dados
db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

module.exports = db; // Exporta a conexão com o banco