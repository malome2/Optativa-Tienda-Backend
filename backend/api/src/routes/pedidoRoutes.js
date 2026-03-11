const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { checkout, getMeusPedidos } = require('../controllers/pedidoControllers');

router.use(authMiddleware);

router.post('/checkout', checkout);
router.get('/', getMeusPedidos);

module.exports = router;
