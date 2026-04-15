import Database from 'better-sqlite3';
const db = new Database('./sentinel.db');
const folders = db.prepare('SELECT id, name FROM folders').all();
console.log(JSON.stringify(folders, null, 2));
