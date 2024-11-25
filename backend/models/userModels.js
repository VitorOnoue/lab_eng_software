const db = require('../config/db');

class User {
  static async findByUsername(username) {
    const query = 'SELECT id FROM users WHERE username = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [username], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }

  static async create(username, password) {
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    return new Promise((resolve, reject) => {
      db.query(query, [username, password], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = User;
