const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const sponsorSchema = new Schema({
    name: String,
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    type: String,
    sponsorshipValue: String,
    state: String,
    email: String,
    logoPath: { 
        type: String,
        required: false
    },
    animalList: [{
        type: String,
        ref: CONFIG.mongodb.collections.animal
    }],
    contactList: [{
        type: String,
    }],
    linkList: [{
        type: String,
    }],
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: { 
        type: Date,
        default: Date.now
    }
});

module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.sponsor, sponsorSchema);