const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mtechmatters.db');

// Create Users Table
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`);

// Create Applications Table
db.run(`
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY(user_id) REFERENCES users(id)
)`);

module.exports = {
  getUserByEmail: (email) => new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  }),
  
  createUser: ({ name, email, password }) => new Promise((resolve, reject) => {
    db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, password], function(err) {
      if (err) reject(err);
      resolve(this.lastID);
    });
  }),
};
