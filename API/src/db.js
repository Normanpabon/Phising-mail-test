const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../db/database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error abriendo la BD', err);
    } else {
        db.run(`
            CREATE TABLE IF NOT EXISTS UsersRegs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                request_id TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                ip_address_user TEXT
            )
        `);
    }
});

function insertRequest(requestId, ipAddress) {
    const query = `INSERT INTO UsersRegs (request_id, ip_address_user) VALUES (?, ?)`;
    db.run(query, [requestId, ipAddress], (err) => {
        if (err) {
            console.error('Error ingresando datos', err);
        }
    });
}

module.exports = {
    insertRequest,
    db
};