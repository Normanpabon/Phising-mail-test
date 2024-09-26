const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

//const dbPath = path.resolve(__dirname, '../db/database.sqlite');

// Ruta de la carpeta y archivo de la base de datos
const dbDirPath = path.resolve(__dirname, '../db');
const dbPath = path.resolve(dbDirPath, 'database.sqlite');

// Verificar si la carpeta 'db' existe, si no, crearla
if (!fs.existsSync(dbDirPath)) {
    fs.mkdirSync(dbDirPath, { recursive: true });
    console.log(`Carpeta ${dbDirPath} creada.`);
}

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