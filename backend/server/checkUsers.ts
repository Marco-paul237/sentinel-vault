import Database from 'better-sqlite3';

const db = new Database('./sentinel.db');
const users = db.prepare('SELECT id, email, role, length(password_hash) as hash_len FROM users').all();
console.log(JSON.stringify(users, null, 2));
