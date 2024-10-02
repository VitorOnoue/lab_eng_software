import { render, screen } from '@testing-library/react';
import App from './App';

test('renders upload link', () => {
  render(<App />); // Remova o BrowserRouter, já que o App já contém o Router
  const linkElement = screen.getByText(/Upload de Contas/i); // Verifique algo que realmente existe no App
  expect(linkElement).toBeInTheDocument();
});

test('renders relatorios link', () => {
  render(<App />); // Outro teste para verificar o link de Relatórios
  const linkElement = screen.getByText(/Relatórios/i);
  expect(linkElement).toBeInTheDocument();
});
