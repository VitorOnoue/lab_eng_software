const mockBackend = {
    uploadFile: (file) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: 'Upload bem-sucedido!' });
        }, 1000);
      });
    },
  
    fetchReports: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              { id: 1, nome: 'Relatório 1', status: 'Processado' },
              { id: 2, nome: 'Relatório 2', status: 'Em andamento' },
            ],
          });
        }, 1000);
      });
    },
  };
  
  export default mockBackend;
  