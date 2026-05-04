const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getDashboardUsuari, getDashboardAdmin } = require('../controllers/dashboardControllers');

/**
 * @swagger
 * /api/dashboard/usuari:
 *   get:
 *     summary: Dashboard de l'usuari autenticat
 *     description: Retorna el perfil de l'usuari, el seu historial de pedidos i el total gastat.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dades del dashboard d'usuari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     usuari:
 *                       type: object
 *                     pedidos:
 *                       type: array
 *                     totalGastat:
 *                       type: number
 *       401:
 *         description: No autenticat
 */
router.get('/usuari', authMiddleware, getDashboardUsuari);

/**
 * @swagger
 * /api/dashboard/admin:
 *   get:
 *     summary: Dashboard d'administrador
 *     description: Retorna estadístiques generals, llista d'usuaris i tots els pedidos. Només accessible per admins.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dades del dashboard d'admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalUsuaris:
 *                           type: number
 *                         totalPedidos:
 *                           type: number
 *                         totalVendes:
 *                           type: number
 *                         pedidosPerEstat:
 *                           type: object
 *                     usuaris:
 *                       type: array
 *                     pedidos:
 *                       type: array
 *       401:
 *         description: No autenticat
 *       403:
 *         description: Accés prohibit
 */
router.get('/admin', authMiddleware, roleMiddleware('admin'), getDashboardAdmin);

module.exports = router;
