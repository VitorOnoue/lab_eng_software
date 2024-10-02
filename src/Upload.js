import React, { useState } from 'react';
import mockBackend from './mockBackend';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'image/png' && selectedFile.size <= 1000000) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Arquivo inválido. Apenas PNG com tamanho até 1MB é aceito.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const response = await mockBackend.uploadFile(file);
      alert(response.message);
    }
  };

  return (
    <div>
      <h2>Upload de Contas</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        {error && <p>{error}</p>}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Upload;
