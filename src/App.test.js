import { render, screen } from '@testing-library/react';
import App from './App';

test('renders upload link', () => {
  render(<App />); 
  const linkElement = screen.getByText(/Upload de Contas/i); 
  expect(linkElement).toBeInTheDocument();
});

test('renders relatorios link', () => {
  render(<App />); 
  const linkElement = screen.getByText(/Relatórios/i);
  expect(linkElement).toBeInTheDocument();
});
