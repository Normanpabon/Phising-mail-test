const inquirer = require('inquirer');

async function askForAction() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: '¿Qué deseas hacer?',
            choices: ['Enviar correos', 'Generar reporte'],
        },
    ]);
    return action;
}

async function askForEmailDetails() {
    const { fromEmail, smtp, password } = await inquirer.prompt([
        {
            type: 'input',
            name: 'fromEmail',
            message: 'Ingresa el correo del remitente:',
        },
        {
            type: 'confirm',
            name: 'smtp',
            message: '¿Deseas usar un servidor SMTP (como Gmail)?',
        },
        {
            type: 'password',
            name: 'password',
            message: 'Ingresa la contraseña del correo (deja en blanco si no usas SMTP):',
            when: (answers) => answers.smtp,
        },
    ]);

    return { fromEmail, smtp, password };
}

async function askForApiConfirmation() {
    const { confirm } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: '¿La API está detenida? (Debe estarlo para procesar los datos)',
        },
    ]);

    return confirm;
}

module.exports = {
    askForAction,
    askForEmailDetails,
    askForApiConfirmation
};