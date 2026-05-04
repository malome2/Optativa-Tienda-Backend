const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createStripeSession, getSessionStatus } = require('../controllers/checkoutController');

/**
 * @swagger
 * /api/checkout/create-session:
 *   post:
 *     summary: Crear una sessió de pagament Stripe
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pais, carrer, codiPostal]
 *             properties:
 *               pais:
 *                 type: string
 *                 example: "Espanya"
 *               carrer:
 *                 type: string
 *                 example: "Carrer Major, 10"
 *               pis:
 *                 type: string
 *                 example: "2n 1a"
 *               codiPostal:
 *                 type: string
 *                 example: "08001"
 *     responses:
 *       200:
 *         description: Sessió creada, retorna sessionId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 sessionId:
 *                   type: string
 *       400:
 *         description: Dades incorrectes o cistella buida
 *       401:
 *         description: No autenticat
 */
router.post('/create-session', authMiddleware, createStripeSession);

/**
 * @swagger
 * /api/checkout/session/{sessionId}:
 *   get:
 *     summary: Obtenir l'estat d'un pedido per sessionId de Stripe
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sessió Stripe
 *     responses:
 *       200:
 *         description: Dades del pedido
 *       404:
 *         description: Pedido no trobat
 *       401:
 *         description: No autenticat
 */
router.get('/session/:sessionId', authMiddleware, getSessionStatus);

module.exports = router;
