CREATE TABLE IF NOT EXISTS pdf_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pdf_id INT NOT NULL,
    invoice_value DECIMAL(10,2) NOT NULL,
    invoice_date DATE NOT NULL,
    FOREIGN KEY (pdf_id) REFERENCES pdf_files(id)
);