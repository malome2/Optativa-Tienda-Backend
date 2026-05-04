// src/routes/jocRoutes.js
const express = require('express');
const router = express.Router();
const jocCtrl = require('../controllers/jocControllers');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un joc
 *     tags: [Productes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               preu:
 *                 type: number
 *     responses:
 *       201:
 *         description: Joc creat correctament
 *       400:
 *         description: Error en les dades
 */
router.post('/', authMiddleware, roleMiddleware('admin'), jocCtrl.crearJoc);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Llistar tots els jocs
 *     tags: [Productes]
 *     responses:
 *       200:
 *         description: Llista de jocs
 */
router.get('/', jocCtrl.obtenerJocs);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtenir un joc per ID
 *     tags: [Productes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Joc trobat
 *       404:
 *         description: Joc no trobat
 */
router.get('/:id', jocCtrl.obtenerJoc);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Modificar un joc
 *     tags: [Productes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Joc modificat correctament
 *       404:
 *         description: Joc no trobat
 */
router.put('/:id', authMiddleware, roleMiddleware('admin'), jocCtrl.modificarJoc);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un joc
 *     tags: [Productes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Joc eliminat correctament
 *       404:
 *         description: Joc no trobat
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), jocCtrl.borrarJoc);

module.exports = router;
