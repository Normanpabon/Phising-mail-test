const express = require('express');
const { insertRequest } = require('./db');
const path = require('path');

const router = express.Router();

// GET /API/Phis/:id
router.get('/Phis/:id', (req, res) => {
    const requestId = req.params.id;
    
    const ipAddress = req.ip;

    // TODO: Validar que el id sea valido y crear una llave de confirmacion para evitar peticiones no deseadas y duplicadas
    
    if (isNaN(requestId)) {
        
        //console.log(`El id de la petición no es numérico: ${requestId}`);

        // Si pide la imagen del html
        if(requestId == 'polishcow.gif'){
            return res.sendFile(path.join(__dirname, './page/polishcow.gif'));
        }
    
    }else{
        console.log('\n----------------------------------------------------------------------');
        console.log(`Petición recibida con id: ${requestId} desde la IP: ${ipAddress}`);
        console.log('----------------------------------------------------------------------');
        insertRequest(requestId, ipAddress);
    }
       
    //res.send({ message: `Registro guardado con id: ${requestId}` });
    res.sendFile(path.join(__dirname, './page/response.html'));
});

// GET /API/Phis/Health
router.get('/Phis/Health', (req, res) => {
    res.send('API funcionando correctamente');
});

module.exports = router;