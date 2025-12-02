const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const specialistSchema = new Schema({
    name: String,
    avatar: {
        type: Number,
        default: 1
    },
    afiliation: String,
    inicialDegree: String,
    startedAt:{
        type: Date,
        default: Date.now
    },
    state: {
        type: String,
        default: 'ativo'
    },
    focusGroup: String,
    specializedAnimal: [{
        type: String,
        ref: CONFIG.mongodb.collections.animal
    }],
    contacts: [{
        type: String,
    }],
    description: String,
});

module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.specialist, specialistSchema);