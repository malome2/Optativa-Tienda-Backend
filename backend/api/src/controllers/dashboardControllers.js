const dashboardServices = require('../services/dashboardServices');

const getDashboardUsuari = async (req, res) => {
    try {
        const data = await dashboardServices.getDashboardUsuari(req.usuariId);
        return res.json({ status: 'success', data });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

const getDashboardAdmin = async (req, res) => {
    try {
        const data = await dashboardServices.getDashboardAdmin();
        return res.json({ status: 'success', data });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

module.exports = { getDashboardUsuari, getDashboardAdmin };
