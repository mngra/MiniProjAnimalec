const Specialist = require('../models/specialist.model');
const {
    validationResult
} = require('express-validator');
const SpecialistMessages = require("../messages/specialist.messages");

exports.get = (req, res) => {

    Specialist.find(req.query).populate("questions").exec((error, quizzes) => {
        if (error) throw error;
        let message = SpecialistMessages.success.s2;

        if (quizzes.length < 0)
            message = SpecialistMessages.success.s5;

        message.body = quizzes;
        return res.status(message.http).send(message);
    });

}

exports.create = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    new Specialist({
        name: req.body.name,
        afiliation: req.body.afiliation,
        inicialDegree: req.body.inicialDegree,
        startedAt: req.body.startedAt,
        state: req.body.state,
        focusGroup: req.body.focusGroup,
        specializedAnimal: req.body.specializedAnimal,
        contacts: req.body.contacts,
        description: req.body.description,
        avatar: req.body.avatar,
    }).save((error, specialist) => {
        if (error) throw error;
        let message = SpecialistMessages.success.s0;
        message.body = specialist;
        return res.header("location", "/specialists/" + specialist._id).status(message.http).send(message);
    });
}
exports.update = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Specialist.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: req.body
    }, {
        new: true
    }, (error, specialist) => {
        if (error) throw error;
            if (!specialist) return res.status(SpecialistMessages.error.e0.http).send(SpecialistMessages.error.e0);
                let message = SpecialistMessages.success.s1;
                message.body = specialist;
                return res.status(message.http).send(message);
    });
}
exports.delete = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Specialist.deleteOne({
        _id: req.params.id
    }, (error, result) => {
        if (error) throw error;
        if (result.deletedCount <= 0) return res.status(SpecialistMessages.error.e0.http).send(SpecialistMessages.error.e0);
        return res.status(SpecialistMessages.success.s3.http).send(SpecialistMessages.success.s3);

    });
}

exports.getOne = (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Specialist.findOne({
            _id: req.params.id
        }, (error, specialist) => {
            if (error) throw error;
            if (!user) return res.status(SpecialistMessages.error.e1.http).send(SpecialistMessages.error.e1);
            let message = SpecialistMessages.success.s2;
            message.body = specialist;
            return res.status(message.http).send(message);
        });
}

exports.activate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Specialist.updateOne({
        _id: req.params.id
    }, {
        $set: {
            state: "ativo"
        }
    }, (error, result) => {
        if (error) throw error;
        
        if (result.n <= 0) return res.status(SpecialistMessages.error.e0.http).send(SpecialistMessages.error.e0);
        return res.status(SpecialistMessages.success.s6.http).send(SpecialistMessages.success.s6);

    });
}

exports.deactivate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Specialist.updateOne({
        _id: req.params.id
    }, {
        $set: {
            state: "inativo"
        }
    }, (error, result) => {
        if (error) throw error;
        
        if (result.n <= 0) return res.status(SpecialistMessages.error.e0.http).send(SpecialistMessages.error.e0);
        return res.status(SpecialistMessages.success.s4.http).send(SpecialistMessages.success.s4);

    });
}