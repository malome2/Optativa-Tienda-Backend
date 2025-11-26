const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');

router.post('/registro', userControllers.crearUsuari);
router.post('/login', userControllers.loginUsuari);
router.post('/refresh', userControllers.refreshToken);


module.exports = router;
