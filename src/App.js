import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Upload from './Upload';
import Relatorios from './Relatorios';
import './styles.css';

const App = () => (
  <Router>
    <div className="container">
      <nav className="navbar">
        <ul>
          <li><Link to="/upload" className={({ isActive }) => (isActive ? 'active' : '')}>Upload de Contas</Link></li>
          <li><Link to="/relatorios" className={({ isActive }) => (isActive ? 'active' : '')}>Relatórios</Link></li>
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
