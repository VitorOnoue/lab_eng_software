const mysql = require('mysql2');

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Substitua pelo seu usuário do MySQL
    password: 'ghvb1211G@G', // Substitua pela sua senha do MySQL
    database: 'sys' // Substitua pelo nome do seu banco de dados
});

// Conecta ao banco de dados
db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

module.exports = db; // Exporta a conexão com o banco
