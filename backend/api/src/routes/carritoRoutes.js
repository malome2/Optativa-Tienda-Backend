const express = require('express');
const router = express.Router();
const carritoCtrl = require('../controllers/carritoControllers');
const authMiddleware = require('../middleware/authMiddleware');

// Totes les rutes del carrito requereixen autenticació
router.use(authMiddleware);

router.get('/', carritoCtrl.getCarrito);                    // Obtenir cistella
router.post('/', carritoCtrl.addJoc);                       // Afegir joc
router.put('/:jocId', carritoCtrl.updateQuantitat);         // Actualitzar quantitat
router.delete('/clear', carritoCtrl.clearCarrito);          // Buidar cistella
router.delete('/:jocId', carritoCtrl.removeJoc);            // Eliminar un joc

module.exports = router;