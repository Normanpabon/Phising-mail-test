const express = require('express');
const { insertRequest } = require('./db');

const router = express.Router();

// GET /API/Phis/:id
router.get('/Phis/:id', (req, res) => {
    const requestId = req.params.id;
    const ipAddress = req.ip;

    insertRequest(requestId, ipAddress);
    res.send({ message: `Registro guardado con id: ${requestId}` });
});

// GET /API/Phis/Health
router.get('/Phis/Health', (req, res) => {
    res.send('API funcionando correctamente');
});

module.exports = router;