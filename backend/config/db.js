const mysql = require('mysql2');

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin', // Substitua pelo seu usuário do MySQL
    password: 'engenhariasoftwaretaosso', // Substitua pela sua senha do MySQL
    database: 'eng-db' // Substitua pelo nome do seu banco de dados
});

// Conecta ao banco de dados
db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

module.exports = db; // Exporta a conexão com o banco



/*
db instance identifier eng-db
master username admin
senha engenhariasoftwaretaosso
endpoint eng-db.c5mu0ekkaz0m.us-east-1.rds.amazonaws.com
*/