const { parseCsv } = require('./src/csvParser');
const { insertPerson, updatePersonOpenedEmail, db } = require('./src/dbHandler');
const { sendEmail } = require('./src/emailSender');
const { askForAction, askForEmailDetails, askForApiConfirmation } = require('./src/promptHandler');
const { generateCsvReport } = require('./src/csvReport');
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
            console.log('Usando configuración de Google', fromEmail, password);
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
                //service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465, // Puerto para STARTTLS
                secure: true, // Usar STARTTLS en lugar de SSL
                auth: {
                    user: fromEmail,
                    pass: emailDetails.password
                },
            } : null;
        }

        let host, port;

        // Cargar info del servidor desde el archivo de configuración

        host = config.server.host;
        port = config.server.port;

        const people = await parseCsv();

        for (const person of people) {
            const id = await insertPerson(person.email, person.nombre, person.area);
    
            const emailContent = `
                <p>${config.message.body}</p>
                <p><a href="http://${host}:${port}/API/Phis/${id}">Reclama tu bono aquí</a></p>
            `;
    
            // Verifica que `person.email` tiene un valor válido antes de enviar
            if (person.email) {
                await sendEmail(fromEmail, person.email, config.message.subject, emailContent, smtpConfig);
            } else {
                console.error(`Correo no válido para ${person.nombre}`);
            }
        }
    } else if (action === 'Generar reporte') {
        const confirmed = await askForApiConfirmation();

        if (confirmed) {
            try {
                const report = await generateCsvReport();
                console.log(`Reporte generado: ${report.totalCorreos} correos enviados, ${report.correosAbiertos} abiertos (${report.porcentajeAbiertos}%).`);
            } catch (error) {
                console.error('Error al generar el reporte:', error);
            }
        } else {
            console.log('Operación cancelada.');
        }
    }
}

main();