const express = require('express');
const { insertRequest } = require('./db');

const router = express.Router();

// POST /API/Phis/:id
router.post('/Phis/:id', (req, res) => {
    const requestId = req.params.id;
    const ipAddress = req.ip;

    insertRequest(requestId, ipAddress);
    res.status(201).send({ message: `Registro guardado con id: ${requestId}` });
});

// GET /API/Phis/Health
router.get('/Phis', (req, res) => {
    res.send('API funcionando correctamente');
});

module.exports = router;