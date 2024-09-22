const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../db/personas.sqlite');

// Inicializar la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        db.run(`
            CREATE TABLE IF NOT EXISTS personas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT,
                nombre TEXT,
                area TEXT,
                envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                abrio_correo BOOLEAN DEFAULT 0,
                fecha_apertura_correo TIMESTAMP
            )
        `);
    }
});

function insertPerson(email, nombre, area) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO personas (email, nombre, area) VALUES (?, ?, ?)`;
        db.run(query, [email, nombre, area], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

function updatePersonOpenedEmail(id, timestamp) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE personas SET abrio_correo = 1, fecha_apertura_correo = ? WHERE id = ?`;
        db.run(query, [timestamp, id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function getAllPeople() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM personas`, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    insertPerson,
    updatePersonOpenedEmail,
    getAllPeople,
    db
};