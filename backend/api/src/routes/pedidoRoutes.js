const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { checkout, getMeusPedidos, updateEstat } = require('../controllers/pedidoControllers');

router.use(authMiddleware);

/**
 * @swagger
 * /api/pedidos/checkout:
 *   post:
 *     summary: Realitzar un pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Pedido creat correctament
 *       401:
 *         description: No autenticat
 */
router.post('/checkout', checkout);

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Obtenir els pedidos de l'usuari
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Llista de pedidos
 *       401:
 *         description: No autenticat
 */
router.get('/', getMeusPedidos);
router.put('/:id', roleMiddleware('admin'), updateEstat);

module.exports = router;
