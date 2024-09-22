const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const csvPath = path.resolve(__dirname, '../personas.csv');

// Función para detectar el delimitador (coma o punto)
function detectDelimiter(line) {
    const commaCount = (line.match(/,/g) || []).length;
    const periodCount = (line.match(/\./g) || []).length;
    
    // Elige el delimitador con más ocurrencias
    return commaCount > periodCount ? ',' : '.';
}

function parseCsv() {
    return new Promise((resolve, reject) => {
        const people = [];

        // Leer el archivo CSV
        fs.readFile(csvPath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }

            const lines = data.split('\n').filter(Boolean); // Dividir por líneas y eliminar líneas vacías
            const delimiter = detectDelimiter(lines[0]);    // Detectar el delimitador en la primera línea

            // Configuración del parser
            const parser = parse({
                delimiter,
                columns: ['email', 'nombre', 'area'],  // Definir las columnas de forma explícita
                trim: true
            });

            parser.on('readable', function() {
                let record;
                while ((record = parser.read())) {
                    // Ahora `record` tiene las columnas correctas
                    people.push(record);
                }
            });

            parser.on('error', function(err) {
                reject(err);
            });

            parser.on('end', function() {
                resolve(people);
            });

            parser.write(data);
            parser.end();
        });
    });
}

module.exports = {
    parseCsv
};