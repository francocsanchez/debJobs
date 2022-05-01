const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const usuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    token: String,
    expira: Date
});

usuariosSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

module.exports = mongoose.model('Usuario', usuariosSchema);