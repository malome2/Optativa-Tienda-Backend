
const usuari = require('../models/usuari');

const createUser = async (data) => {
    const user = new user(data);
    return await user.save();
};

const getUserById = async (id) => {
    return await user.findById(id);
};

const updateUser = async (id, updateData) => {
    return await user.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

const deleteUser = async (id) => {
    return await user.findByIdAndDelete(id);
};

module.exports = {
    deleteUser,
    updateUser,
    createUser,
    getUserById
};
