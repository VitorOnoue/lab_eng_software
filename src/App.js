import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Upload from '../../lab_eng_software/src/Upload';
import Relatorios from '../../lab_eng_software/src/Relatorios';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/upload">Upload de Contas</Link></li>
            <li><Link to="/relatorios">Relatórios</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/upload" element={<Upload />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
