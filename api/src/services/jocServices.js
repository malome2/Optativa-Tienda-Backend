// src/services/jocService.js
const Joc = require('../models/joc');

const createJoc = async (data) => {
    const joc = new Joc(data);
    return await joc.save();
};

const getAllJocs = async (filter = {}, options = {}) => {
    // soporta paginación básica
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = Joc.find(filter).skip(skip).limit(limit);
    if (options.sort) query.sort(options.sort);

    const data = await query.exec();
    const total = await Joc.countDocuments(filter);
    return { data, total, page, limit };
};

const getJocById = async (id) => {
    return await Joc.findById(id);
};

const updateJoc = async (id, updateData) => {
    return await Joc.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

const deleteJoc = async (id) => {
    return await Joc.findByIdAndDelete(id);
};

module.exports = {
    createJoc,
    getAllJocs,
    getJocById,
    updateJoc,
    deleteJoc
};
