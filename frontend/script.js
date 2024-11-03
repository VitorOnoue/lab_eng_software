// script.js
const apiurl = '54.235.231.3';
document.addEventListener("DOMContentLoaded", function() {
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const welcomeScreen = document.getElementById('welcome-screen');

    // Função para lidar com o login
    async function handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('usuario').value;
        const password = document.getElementById('senha').value;
    
        try {
            const response = await fetch(`http://${apiurl}/api/login`, {
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
    
                // **Adicionar um pequeno atraso para garantir que o DOM seja atualizado**
                setTimeout(async () => {
                    // Após o welcome-screen ser exibido, buscar dados e renderizar o gráfico
                    await fetchAndRenderChart();
                }, 100); // Atraso de 100ms
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    }

    // Função para lidar com o registro
    async function handleRegister(event) {
        event.preventDefault();
        
        const username = document.getElementById('new-usuario').value;
        const password = document.getElementById('new-senha').value;

        try {
            const response = await fetch(`http://${apiurl}/api/register`, {
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

    // Funções de alternância no escopo global
    window.toggleRegister = function() {
        console.log('toggleRegister chamado');
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    };

    window.toggleLogin = function() {
        console.log('toggleLogin chamado');
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    };

    // Adiciona os event listeners aos formulários
    document.getElementById("login-form").addEventListener("submit", handleLogin);
    document.getElementById("register-form").addEventListener("submit", handleRegister);

    // Função de upload de PDF no escopo global
    window.handlePdfUpload = async function(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;
    
        const formData = new FormData();
        for (const file of files) {
            formData.append('pdfs', file);
        }
    
        try {
            const response = await fetch(`http://${apiurl}/api/upload-pdf`, {
                method: 'POST',
                body: formData
            });
    
            const data = await response.json();
            console.log('Resposta do servidor:', data); // Log da resposta
    
            if (response.ok) {
                alert('PDFs enviados e salvos no banco de dados com sucesso!');
                // Atualiza o gráfico após o upload
                await fetchAndRenderChart();
            } else {
                alert(data.message || 'Erro ao enviar os PDFs');
            }
        } catch (error) {
            console.error('Erro no upload dos PDFs:', error);
        }
    };

    // Função para buscar dados e renderizar o gráfico
    async function fetchAndRenderChart() {
        try {
            const response = await fetch(`http://${apiurl}/api/expenses-per-month`);
            const data = await response.json();

            if (response.ok) {
                renderChart(data);
            } else {
                console.error('Erro ao obter dados das despesas:', data.message);
            }
        } catch (error) {
            console.error('Erro ao buscar dados das despesas:', error);
        }
    }

    // Função para renderizar o gráfico usando Chart.js
    function renderChart(data) {
        const canvas = document.getElementById('expensesChart');
        if (!canvas) {
            console.error("Elemento canvas com id 'expensesChart' não encontrado.");
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Não foi possível obter o contexto do canvas.");
            return;
        }

        // Verifica se window.expensesChart existe e é uma instância de Chart
        if (window.expensesChart instanceof Chart) {
            window.expensesChart.destroy();
            console.log('Gráfico anterior destruído.');
        } else {
            console.log('Nenhum gráfico anterior para destruir.');
        }

        // Cria o gráfico e atribui a window.expensesChart
        window.expensesChart = new Chart(ctx, {
            type: 'line', // Alterado para gráfico de linhas
            data: {
                labels: data.map(item => item.month),
                datasets: [{
                    label: 'Consumo de Energia (kWh)',
                    data: data.map(item => item.total_expenses),
                    backgroundColor: 'rgba(0, 123, 255, 0.2)', // Azul claro
                    borderColor: '#007BFF', // Azul
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3, // Suaviza as linhas
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Histórico de Consumo de Energia',
                        font: {
                            size: 22
                        }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = 'Consumo: ' + context.parsed.y + ' kWh';
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Consumo (kWh)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Mês'
                        }
                    }
                }
            }
        });

        // Adicionar classe 'visible' para animação
        document.querySelector('.chart-container').classList.add('visible');

        // Log para depuração
        console.log('window.expensesChart após a criação:', window.expensesChart);
    }
});
