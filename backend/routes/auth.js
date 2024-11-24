const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importa a configuração do banco de dados

// Rota de autenticação
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro ao consultar o banco de dados.' });

        if (results.length > 0) {
            const user = results[0];

            // Verifica se a senha corresponde
            if (user.password === password) {
                return res.json({ message: 'Login bem-sucedido!' });
            } else {
                return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
            }
        } else {
            return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
        }
    });
});

// Rota de cadastro
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });

        return res.json({ message: 'Usuário cadastrado com sucesso!' });
    });
});

module.exports = router; // Exporta as rotas
