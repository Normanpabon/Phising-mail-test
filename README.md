
# Herramienta de Pruebas de Phishing Controladas

## Descripción

Esta herramienta permite realizar **pruebas de phishing controladas** a empleados designados de una organización. Su propósito principal es evaluar la respuesta ante ataques de ingeniería social, como parte de auditorías internas de seguridad. La herramienta envía correos electrónicos a los empleados para medir su reacción, y recopila datos sobre quiénes abrieron el correo y cuándo lo hicieron.

### Funcionalidades principales:
- **Envío de correos de phishing** a empleados designados a través de un servidor local (en Linux) o una cuenta de Gmail.
- **Procesamiento de datos** para generar informes detallados sobre quién abrió el correo.
- La API se encarga de montar un servidor **HTTP/HTTPS** para el procesamiento de los datos.
  
La herramienta está diseñada para ejecutarse en **Node.js**, permitiendo un entorno de servidor eficiente para realizar las pruebas y generar reportes.

## Requisitos

Para usar esta herramienta, necesitas tener **Node.js** instalado en tu sistema. Además, es necesario instalar las dependencias con `npm`.

### Requisitos previos:
- **Node.js** (v10.5.0 o superior)
- **npm** (instalado junto con Node.js)

## Instalación

1. Clona el repositorio a tu máquina local.
2. Instala las dependencias necesarias tanto para la API como para la aplicación de envío de correos:

   ```bash
   # Para la API
   cd /API
   npm install

   # Para la aplicación de envío de correos
   cd /APP
   npm install
   ```

## Configuración API REST
Antes de ejecutar la herramienta, debes configurar correctamente el archivo `config.json` para la API REST, encargada de la recepcion de peticiones por parte de los usuarios. El formato de `config.json` es el siguiente:

```json
{
    "server": {
        "host": "0.0.0.0",
        "httpPort": 3012,
        "httpsPort": 3443
    }
}
```
- **`server`**: Configura la direccion IPV4 publica del servidor y los puertos HTTP y HTTPS de escucha de conexiones.

## Configuración APP

Antes de ejecutar la herramienta, debes configurar correctamente el archivo `config.json` para la aplicación de envío de correos. Este archivo debe contener la configuración del servidor y de los correos electrónicos que se enviarán. El formato del archivo `config.json` es el siguiente:

```json
{
  "server": {
    "host": "127.0.0.1",
    "port": 3012
  },
  "email": {
    "fromEmail": "correo@gmail.com",
    "useGoogle": true,
    "password": "clave segura"
  },
  "message": {
    "subject": "Has ganado un bono de MercadoLibre",
    "body": "Felicidades, has ganado un bono de MercadoLibre! Reclámalo haciendo clic en el siguiente enlace."
  }
}
```

- **`server`**: Configura la dirección y puerto del servidor REST API para el envio del correo que apunta a dicho servidor.
- **`email`**: Configura el correo remitente (puede ser una cuenta de Gmail o un servidor local en Linux). Si `useGoogle` es `true`, se utilizará Gmail y la contraseña debe proporcionarse.
- **`message`**: Contiene el asunto y el cuerpo del mensaje que será enviado a los empleados.

### Nota:
En **Windows**, debido a la limitación de la librería `sendmail`, el envío de correos se realiza exclusivamente a través de cuentas de Gmail. En **Linux**, es posible enviar correos directamente desde el servidor local.


## Ejecución

### 1. Iniciar la API (Servidor HTTP/HTTPS)

La API se encarga de montar el servidor que procesará los datos recibidos cuando un empleado interactúa con los correos de phishing. Para iniciar la API:

```bash
cd /API
node ApiServer.js
```

Esto iniciará el servidor HTTP/HTTPS con **Express** en la dirección y puerto especificados en la configuración.

### 2. Iniciar la aplicación de envío de correos y procesamiento de datos

La aplicación es responsable del envío de correos electrónicos y el procesamiento de los datos de los correos abiertos. Para ejecutar la aplicación:

```bash
cd /APP
node app.js
```

Durante la ejecución, la aplicación te pedirá confirmar las acciones a realizar:
- **Enviar correos**: Enviará correos de phishing a los empleados de acuerdo con la lista proporcionada.
- **Procesar datos**: Procesará los datos recibidos por la API y generará un informe sobre los correos abiertos.

## Funcionamiento General

1. **Envía correos electrónicos** con un enlace que apunta a la API (por ejemplo, "http://127.0.0.1:3012/API/BONO/{id}").
2. Los empleados que abren el correo hacen clic en el enlace, lo cual envía una solicitud a la API para registrar la apertura del correo.
3. Posteriormente, puedes ejecutar la aplicación para **procesar los datos** y generar un informe detallado en CSV que contiene:
   - Nombre del empleado, área, correo, si abrió el correo, fecha de envío y fecha de apertura.

## ToDo

- Generar identificador unico para la peticion de cada empleado, para evitar datos repetidos y/o erroneos si se reciben peticiones de otras fuentes.
- Recibir los codigos de autenticacion de usuarios en la API generados por la app, una vez se reciba dicha peticion con el codigo, marcar el codigo como usado.
- Si el archivo de configuracion no existe, escribir en el archivo 'config.json' del APP, la configuracion dada por el usuario. (APP)
- Manejo de mensajes de error en caso de no encontrar listado de personas o error de lectura del listado.
- Manejo de errores para los json de configuracion
- Verificar la creacion de certificado con SSL en Linux.

## Contribuciones

¡Las contribuciones son bienvenidas! Si tienes alguna sugerencia o mejora, por favor abre un issue o envía un pull request.