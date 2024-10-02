import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Upload from './Upload';
import Relatorios from './Relatorios';

const App = () => (
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

export default App;
