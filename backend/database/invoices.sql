CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(255) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  consumption DECIMAL(10,2) NOT NULL,
  energy_operator VARCHAR(255) NOT NULL,
  taxes DECIMAL(10,2),
  user_id int,
  FOREIGN KEY (user_id) REFERENCES users(id)
);