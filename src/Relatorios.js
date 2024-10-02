import React, { useState, useEffect } from 'react';
import mockBackend from './mockBackend';

const Relatorios = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const response = await mockBackend.fetchReports();
      setReports(response.data);
    };
    fetchReports();
  }, []);

  return (
    <div className="page">
      <h2>Relatórios</h2>
      <table className="reports-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Status</th>
            <th>Dados</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.nome}</td>
              <td>{report.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Relatorios;
