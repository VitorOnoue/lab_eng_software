// script.js

document.addEventListener("DOMContentLoaded", function() {
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const welcomeScreen = document.getElementById('welcome-screen');

    async function handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('usuario').value;
        const password = document.getElementById('senha').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                loginContainer.style.display = 'none';
                welcomeScreen.style.display = 'flex';
                document.querySelector('.welcome-screen h2').innerText = `Bem-vindo, ${username}!`;
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    }

    async function handleRegister(event) {
        event.preventDefault();
        
        const username = document.getElementById('new-usuario').value;
        const password = document.getElementById('new-senha').value;

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Cadastro realizado com sucesso! Faça login agora.');
                toggleLogin(); 
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
        }
    }

    // Funções de alternância agora no escopo global
    window.toggleRegister = function() {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    };

    window.toggleLogin = function() {
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    };

    // Adiciona os event listeners
    document.getElementById("login-form").onsubmit = handleLogin;
    document.getElementById("register-form").onsubmit = handleRegister;

    // Função de upload de PDF no escopo global
    window.handlePdfUpload = async function(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;
    
        const formData = new FormData();
        for (const file of files) {
            formData.append('pdfs', file);
        }
    
        try {
            const response = await fetch('http://localhost:3000/api/upload-pdf', {
                method: 'POST',
                body: formData
            });
    
            const data = await response.json();
            console.log('Resposta do servidor:', data); // Log da resposta
    
            if (response.ok) {
                alert('PDFs enviados e salvos no banco de dados com sucesso!');
            } else {
                alert(data.message || 'Erro ao enviar os PDFs');
            }
        } catch (error) {
            console.error('Erro no upload dos PDFs:', error);
        }
    };
});
