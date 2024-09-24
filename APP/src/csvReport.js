const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv'); // Librería para convertir JSON a CSV

const dbPath = path.resolve(__dirname, '../db/personas.sqlite');
const csvPath = path.resolve(__dirname, '../reporte.csv');

// Función para generar el reporte CSV
function generateCsvReport() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                return reject(`Error al abrir la base de datos: ${err.message}`);
            }
        });

        // Consulta para obtener todos los datos de la tabla personas
        const query = `SELECT nombre, area, email, abrio_correo, envio, fecha_apertura_correo FROM personas`;
        
        db.all(query, [], (err, rows) => {
            if (err) {
                return reject(`Error al leer los datos: ${err.message}`);
            }

            if (rows.length === 0) {
                return reject('No hay registros en la base de datos.');
            }

            // Procesar los datos para el reporte
            const totalCorreos = rows.length;
            const correosAbiertos = rows.filter(row => row.abrio_correo).length;
            const porcentajeAbiertos = ((correosAbiertos / totalCorreos) * 100).toFixed(2);

            // Convertir los datos al formato CSV
            const fields = ['Nombre persona', 'area', 'correo', 'abrio el correo', 'fecha de envio', 'fecha de apertura'];
            const csvData = rows.map(row => ({
                'Nombre persona': row.nombre,
                'area': row.area,
                'correo': row.email,
                'abrio el correo': row.abrio_correo ? 'Sí' : 'No',
                'fecha de envio': row.envio,
                'fecha de apertura': row.fecha_apertura_correo || 'N/A'
            }));

            try {
                const csv = parse(csvData, { fields });
                fs.writeFileSync(csvPath, csv);
            } catch (err) {
                return reject(`Error al generar el CSV: ${err.message}`);
            }

            // Mostrar el resultado en consola
            console.log(`Reporte CSV generado en: ${csvPath}`);
            console.log(`Total de correos enviados: ${totalCorreos}`);
            console.log(`Total de correos abiertos: ${correosAbiertos}`);
            console.log(`Porcentaje de correos abiertos: ${porcentajeAbiertos}%`);

            resolve({
                totalCorreos,
                correosAbiertos,
                porcentajeAbiertos
            });
        });

        db.close();
    });
}

module.exports = {
    generateCsvReport
};
