const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const vacantesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'El nombre de la vacante es requerido',
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true,
        required: 'La ubicacion es requerida'
    },
    salary: {
        type: String,
        default: 0,
        trim: true
    },
    contract: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    candidates: [{
        name: String,
        email: String,
        cv: String
    }],
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuario',
        required: 'El autor es obligatorio'
    }
});

vacantesSchema.pre('save', function (next) {

    const url = slug(this.title);
    this.url = `${url}-${shortid.generate()}`

    next();
})

module.exports = mongoose.model('Vacante', vacantesSchema);