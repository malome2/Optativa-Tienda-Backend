const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Carrito = require('../models/carrito');
const Pedido = require('../models/pedido');
const Direccio = require('../models/direccio');

const createStripeSession = async (req, res) => {
    try {
        const { pais, carrer, pis, codiPostal } = req.body;

        if (!pais || !carrer || !codiPostal) {
            return res.status(400).json({ status: 'error', message: 'Pais, carrer i codi postal són obligatoris' });
        }

        const carrito = await Carrito.findOne({ usuari: req.usuariId }).populate('jocs.joc');
        if (!carrito || carrito.jocs.length === 0) {
            return res.status(400).json({ status: 'error', message: 'La cistella és buida' });
        }

        const total = carrito.jocs.reduce((sum, item) => sum + item.joc.preu * item.quantitat, 0);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: carrito.jocs.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: { name: item.joc.titol },
                    unit_amount: Math.round(item.joc.preu * 100)
                },
                quantity: item.quantitat
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
        });

        const direccio = await Direccio.create({ pais, carrer, pis, codiPostal, usuari: req.usuariId });
        const pedido = await Pedido.create({
            usuari: req.usuariId,
            direccio: direccio._id,
            total: parseFloat(total.toFixed(2)),
            jocs: carrito.jocs.map(item => ({ joc: item.joc._id, quantitat: item.quantitat })),
            stripeSessionId: session.id
        });

        req.log.info({
            requestId: req.requestId,
            orderId: pedido._id,
            userId: req.usuariId,
            total: pedido.total
        }, 'Order created, Stripe session initiated');

        return res.json({ status: 'success', sessionId: session.id, url: session.url });
    } catch (err) {
        req.log.error({
            requestId: req.requestId,
            userId: req.usuariId,
            error: err.message
        }, 'Payment session creation failed');
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).json({ message: `Webhook error: ${err.message}` });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const pedido = await Pedido.findOneAndUpdate(
            { stripeSessionId: session.id },
            { estat: 'pagat' }
        );
        if (pedido) {
            await Carrito.findOneAndUpdate({ usuari: pedido.usuari }, { jocs: [] });
            console.log(`Payment confirmed for order ${pedido._id}`);
        }
    }

    return res.json({ received: true });
};

const getSessionStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const pedido = await Pedido.findOne({ stripeSessionId: sessionId, usuari: req.usuariId })
            .populate('jocs.joc', 'titol preu')
            .populate('direccio');

        if (!pedido) {
            return res.status(404).json({ status: 'error', message: 'Pedido no trobat' });
        }

        if (pedido.estat === 'pendent') {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            if (session.payment_status === 'paid') {
                pedido.estat = 'pagat';
                await pedido.save();
                await Carrito.findOneAndUpdate({ usuari: req.usuariId }, { jocs: [] });
            }
        }

        return res.json({ status: 'success', data: pedido });
    } catch (err) {
        req.log.error({
            requestId: req.requestId,
            userId: req.usuariId,
            error: err.message
        }, 'Payment failed');
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

module.exports = { createStripeSession, stripeWebhook, getSessionStatus };
