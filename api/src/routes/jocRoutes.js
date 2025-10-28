// src/routes/jocRoutes.js
const express = require('express');
const router = express.Router();
const jocCtrl = require('../controllers/jocControllers');

router.post('/', jocCtrl.crearJoc);        // Crear un joc
router.get('/', jocCtrl.obtenerJocs);      // Listar jocs (paginación/filtros)
router.get('/:id', jocCtrl.obtenerJoc);   // Obtener per id
router.put('/:id', jocCtrl.modificarJoc); // Modificar (PUT)
router.delete('/:id', jocCtrl.borrarJoc); // Borrar

module.exports = router;
