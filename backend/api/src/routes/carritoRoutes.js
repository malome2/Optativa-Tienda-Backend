const express = require('express');
const router = express.Router();
const carritoCtrl = require('../controllers/carritoControllers');
const authMiddleware = require('../middleware/authMiddleware');

// Totes les rutes del carrito requereixen autenticació
router.use(authMiddleware);

/**
 * @swagger
 * /api/carrito:
 *   get:
 *     summary: Obtenir la cistella de l'usuari
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cistella obtinguda correctament
 *       401:
 *         description: No autenticat
 */
router.get('/', carritoCtrl.getCarrito);

/**
 * @swagger
 * /api/carrito:
 *   post:
 *     summary: Afegir un joc a la cistella
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jocId:
 *                 type: string
 *               quantitat:
 *                 type: number
 *     responses:
 *       200:
 *         description: Joc afegit correctament
 *       401:
 *         description: No autenticat
 */
router.post('/', carritoCtrl.addJoc);

/**
 * @swagger
 * /api/carrito/{jocId}:
 *   put:
 *     summary: Actualitzar quantitat d'un joc a la cistella
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jocId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quantitat actualitzada
 *       401:
 *         description: No autenticat
 */
router.put('/:jocId', carritoCtrl.updateQuantitat);

/**
 * @swagger
 * /api/carrito/clear:
 *   delete:
 *     summary: Buidar la cistella
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cistella buidada correctament
 *       401:
 *         description: No autenticat
 */
router.delete('/clear', carritoCtrl.clearCarrito);

/**
 * @swagger
 * /api/carrito/{jocId}:
 *   delete:
 *     summary: Eliminar un joc de la cistella
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jocId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Joc eliminat de la cistella
 *       401:
 *         description: No autenticat
 */
router.delete('/:jocId', carritoCtrl.removeJoc);

module.exports = router;