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
    <div>
      <h2>Relatórios</h2>
      <ul>
        {reports.map((report) => (
          <li key={report.id}>
            {report.nome} - {report.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Relatorios;
