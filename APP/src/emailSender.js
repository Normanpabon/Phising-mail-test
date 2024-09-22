const nodemailer = require('nodemailer');

async function sendEmail(from, to, subject, html, smtpConfig) {
    console.log('Enviando correo...', to);
    let transporter;

    // Configuración personalizada o Gmail
    if (smtpConfig) {
        transporter = nodemailer.createTransport(smtpConfig);
    } else {
        // Si no se proporciona SMTP, configuramos un servidor SMTP local
        transporter = nodemailer.createTransport({
            host: 'localhost',  // Cambiar a tu servidor SMTP local si tienes uno
            port: 25,           // Puerto por defecto de SMTP
            secure: false,      // Solo utilizar "secure" si estás usando SSL
            tls: {
                rejectUnauthorized: false // Esto permite que acepte cualquier certificado (autofirmado)
            }
        });
    }

    const info = await transporter.sendMail({
        from,
        to,
        subject,
        html
    });

    console.log(`Correo enviado: ${info.response}`);
}

module.exports = {
    sendEmail
};