const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @swagger
 * /api/users/registro:
 *   post:
 *     summary: Registre d'usuari
 *     tags: [Usuaris]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *               contrasenya:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuari creat correctament
 *       400:
 *         description: Error en les dades
 */
router.post('/registro', userControllers.crearUsuari);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login d'usuari
 *     tags: [Usuaris]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               contrasenya:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login correcte
 *       400:
 *         description: Credencials incorrectes
 */
router.post('/login', userControllers.loginUsuari);

/**
 * @swagger
 * /api/users/refresh:
 *   post:
 *     summary: Renovar access token
 *     tags: [Usuaris]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nou access token generat
 *       401:
 *         description: Refresh token invàlid
 */
router.post('/refresh', userControllers.refreshToken);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout d'usuari
 *     tags: [Usuaris]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sessió tancada correctament
 *       400:
 *         description: Token no trobat
 */
router.post('/logout', userControllers.logoutUsuari);

router.put('/me', authMiddleware, userControllers.updateMe);
router.put('/:id', authMiddleware, roleMiddleware('admin'), userControllers.updateUsuari);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), userControllers.deleteUsuari);

module.exports = router;
