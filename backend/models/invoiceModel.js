// backend/models/invoiceModel.js

const db = require('../config/db');

class Invoice {
  static async create(data) {
    const query = `
      INSERT INTO invoices (invoice_number, customer_name, invoice_date, due_date, total_amount, energy_operator, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // INSERT INTO invoices (invoice_number, customer_name, invoice_date, due_date, total_amount, consumption, energy_operator, user_id)
    //   VALUES (?, ?, ?, ?, ?, ?, ?, ?)

    const values = [
      data.invoiceNumber,
      data.customerName,
      data.invoiceDate,
      data.dueDate,
      data.totalAmount,
      // data.consumption,
      data.energyOperator,
      14,
    ];

    return new Promise((resolve, reject) => {
      db.query(query, values, (err, results) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return reject(new Error('Fatura duplicada.'));
          }
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static async getExpensesPerMonth() {
    const query = `
      SELECT 
        DATE_FORMAT(invoice_date, '%Y-%m') as month,
        SUM(total_amount) as total_expenses,
        SUM(consumption) as total_consumption
      FROM invoices
      GROUP BY month
      ORDER BY month;
    `;
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = Invoice;
