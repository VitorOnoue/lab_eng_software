const apiurl = "100.26.51.230"; // IP AQUI

document.addEventListener("DOMContentLoaded", function () {
  const loginContainer = document.getElementById("login-container");
  const registerContainer = document.getElementById("register-container");
  const welcomeScreen = document.getElementById("welcome-screen");

  // Função para lidar com o login
  async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("usuario").value;
    const password = document.getElementById("senha").value;

    try {
      const response = await fetch(`http://${apiurl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        loginContainer.style.display = "none";
        welcomeScreen.style.display = "flex";
        document.querySelector(
          ".welcome-screen h2"
        ).innerText = `Bem-vindo, ${username}!`;

        // Atualiza o gráfico
        await fetchAndRenderChart(username);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  }

  // Função para lidar com o registro
  async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById("new-usuario").value;
    const password = document.getElementById("new-senha").value;

    try {
      const response = await fetch(`http://${apiurl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso! Faça login agora.");
        toggleLogin();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    }
  }

  // Funções de alternância
  window.toggleRegister = function () {
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
  };

  window.toggleLogin = function () {
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
  };

  // Event listeners
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document
    .getElementById("register-form")
    .addEventListener("submit", handleRegister);

  // Função de upload de PDF
  window.handlePdfUpload = async function (event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (const file of files) {
      formData.append("pdfs", file);
    }

    const username = document.getElementById("usuario").value;
    formData.append("username", username);
    try {

      const response = await fetch(`http://${apiurl}/api/upload-pdf`, {
        method: "POST",
        headers: {},
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("PDFs enviados e processados com sucesso!");
        // Atualiza o gráfico após o upload
        await fetchAndRenderChart(username);
      } else {
        alert(data.message || "Erro ao enviar os PDFs");
      }
    } catch (error) {
      console.error("Erro no upload dos PDFs:", error);
    }
  };

  // Função para buscar dados e renderizar o gráfico
  async function fetchAndRenderChart(username) {
    try {
      const response = await fetch(`http://${apiurl}/api/expenses-per-month?username=${username}`, {
        headers: {},
      });
      const data = await response.json();

      if (response.ok) {
        renderChart(data);
      } else {
        console.error("Erro ao obter dados das despesas:", data.message);
      }
    } catch (error) {
      console.error("Erro ao buscar dados das despesas:", error);
    }
  }

  // Função para renderizar o gráfico usando Chart.js
  function renderChart(data) {
    const canvas = document.getElementById("expensesChart");
    const ctx = canvas.getContext("2d");

    if (window.expensesChart instanceof Chart) {
      window.expensesChart.destroy();
    }

    window.expensesChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => item.month),
        datasets: [{
            label: "Despesas Totais (R$)",
            data: data.map((item) => item.total_expenses),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            yAxisID: "y",
          },
          {
            label: "Consumo Total (kWh)",
            data: data.map((item) => item.total_consumption),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            type: "linear",
            position: "left",
            title: {
              display: true,
              text: "Despesas (R$)",
            },
          },
          y1: {
            type: "linear",
            position: "right",
            title: {
              display: true,
              text: "Consumo (kWh)",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
          x: {
            title: {
              display: true,
              text: "Mês",
            },
          },
        },
      },
    });

    document.querySelector(".chart-container").classList.add("visible");
  }

  document.getElementById('show-forecast-btn').addEventListener('click', async function () {
    try {
      const username = document.getElementById("usuario").value;
      const response = await fetch(`http://${apiurl}/api/future-expenses?username=${username}`, {
        headers: {},
      });

      const data = await response.json();

      if (response.ok) {
        displayForecast(data);
      } else {
        console.error('Erro ao obter despesas futuras:', data.message);
        alert('Erro ao obter despesas futuras: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao buscar despesas futuras:', error);
      alert('Erro ao buscar despesas futuras.');
    }
  });

  function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-results');
    forecastContainer.style.display = 'block';

    // Atualiza a informação da taxa de inflação
    const inflationInfo = document.getElementById('inflation-info');
    inflationInfo.innerText = `Taxa de Inflação Atual: ${(data.inflationRate * 100).toFixed(2)}%`;

    const tbody = document.querySelector('#forecast-table tbody');
    tbody.innerHTML = ''; // Limpa o conteúdo anterior, se houver

    data.expenses.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
            <td>${item.month}</td>
            <td>R$ ${item.originalExpense}</td>
            <td>R$ ${item.estimatedExpense}</td>
            <td>${item.consumption ? item.consumption : 'N/A'}</td>
        `;
      tbody.appendChild(row);
    });
  }
});