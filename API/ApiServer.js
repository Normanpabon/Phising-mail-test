const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const app = require('./src/app');

// Cargar configuracion de variables de entorno
const configPath = path.resolve(__dirname, './config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Puertos para HTTP y HTTPS
const HTTP_PORT = config.server.httpPort;
const HTTPS_PORT = config.server.httpsPort;
const HOST_IP = config.server.host;

// Ruta certificados SSL
const certPath = path.resolve(__dirname, 'certs');

// Options object for HTTPS
let options = {
    key: null,
    cert: null
};

// Verificamos si los certificados ya existen
const certExists = fs.existsSync(`${certPath}/key.pem`) && fs.existsSync(`${certPath}/cert.pem`);

if (certExists) {
    // Si los certificados existen, cargamos las claves
    options.key = fs.readFileSync(`${certPath}/key.pem`);
    options.cert = fs.readFileSync(`${certPath}/cert.pem`);
} else {
    try {
        // Si no existen, intentamos generar los certificados con OpenSSL
        console.log('No se encontraron certificados, se intentaran generar con openssl...');
        const { execSync } = require('child_process');

        execSync(`openssl version`, { stdio: 'ignore' }); // Verificar que OpenSSL está disponible

        execSync(`openssl req -x509 -newkey rsa:2048 -keyout ${certPath}/key.pem -out ${certPath}/cert.pem -days 365 -nodes -subj "/CN=localhost"`);
        console.log('Certificados generados correctamente.');

        // Cargamos los certificados recién creados
        options.key = fs.readFileSync(`${certPath}/key.pem`);
        options.cert = fs.readFileSync(`${certPath}/cert.pem`);
    } catch (error) {
        // Si OpenSSL no está instalado o hay otro error, informamos al usuario
        console.error(`No se encontro openssl en el path. No se pueden generar los certificados automaticamente.`);
    }
}



// Iniciar el servidor HTTP siempre
http.createServer(app).listen(HTTP_PORT, HOST_IP, () => {
    console.log('-------------------------------------------------------------');
    console.log(`\n\nServidor HTTP corriendo en http://${HOST_IP}:${HTTP_PORT}`);
});

// Solo iniciar el servidor HTTPS si tenemos certificados válidos
if (options.key && options.cert) {
    https.createServer(options, app).listen(HTTPS_PORT, HOST_IP, () => {
        console.log(`\nServidor HTTPS corriendo en https://${HOST_IP}:${HTTPS_PORT}`);
    });
} else {
    console.warn(`No se encontraron certificados, El API funcionara unicamente con http en el puerto ${HTTP_PORT}.`);
}
