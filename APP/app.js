const { parseCsv } = require('./src/csvParser');
const { insertPerson, updatePersonOpenedEmail, db } = require('./src/dbHandler');
const { sendEmail } = require('./src/emailSender');
const { askForAction, askForEmailDetails, askForApiConfirmation } = require('./src/promptHandler');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Leer la configuración desde el archivo config.json
const configPath = path.resolve(__dirname, './config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));


async function main() {
    const action = await askForAction();

    if (action === 'Enviar correos') {
        let fromEmail, password, smtpConfig;

        // Si está definido en el archivo de configuración
        if (config.email.useGoogle) {
            fromEmail = config.email.fromEmail;
            password = config.email.password;
            smtpConfig = {
                service: 'gmail',
                auth: {
                    user: fromEmail,
                    pass: password
                }
            };
        } else {
            // Si no se usa Google, pedir la configuración
            const emailDetails = await askForEmailDetails();
            fromEmail = emailDetails.fromEmail;
            smtpConfig = emailDetails.smtp ? {
                service: 'gmail',
                auth: {
                    user: fromEmail,
                    pass: emailDetails.password
                }
            } : null;
        }

        const people = await parseCsv();

        for (const person of people) {
            const id = await insertPerson(person.email, person.nombre, person.area);
    
            const emailContent = `
                <p>${config.message.body}</p>
                <p><a href="http://192.168.2.13/API/BONO/${id}">Reclama tu bono aquí</a></p>
            `;
    
            // Verifica que `person.email` tiene un valor válido antes de enviar
            if (person.email) {
                await sendEmail(fromEmail, person.email, config.message.subject, emailContent, smtpConfig);
            } else {
                console.error(`Correo no válido para ${person.nombre}`);
            }
        }
    } else if (action === 'Procesar datos') {
        const confirmed = await askForApiConfirmation();

        if (confirmed) {
            const apiDbPath = path.resolve(__dirname, '../API/DB/database.sqlite');
            const apiDb = new sqlite3.Database(apiDbPath);

            apiDb.all(`SELECT * FROM requests`, [], async (err, rows) => {
                if (err) throw err;

                for (const row of rows) {
                    const requestId = row.request_id;
                    const timestamp = row.timestamp;

                    const query = `SELECT * FROM personas WHERE id = ?`;
                    db.get(query, [requestId], async (err, person) => {
                        if (person) {
                            await updatePersonOpenedEmail(requestId, timestamp);
                        }
                    });
                }
            });
        } else {
            console.log('Operación cancelada.');
        }
    }
}

main();