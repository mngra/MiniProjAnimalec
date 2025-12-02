const Sponsor = require('../models/sponsor.model');
const {
    validationResult
} = require('express-validator');
const SponsorMessages = require("../messages/sponsor.messages");

exports.get = (req, res) => {

    Sponsor.find(req.query).populate("questions").exec((error, quizzes) => {
        if (error) throw error;
        let message = SponsorMessages.success.s2;

        if (quizzes.length < 0)
            message = SponsorMessages.success.s5;

        message.body = quizzes;
        return res.status(message.http).send(message);
    });

}

exports.create = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

   new Sponsor({
            name: req.body.name,
            email: req.body.email,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            type: req.body.type, 
            sponsorshipValue: req.body.sponsorshipValue, 
            state: req.body.state, 
            animalList: req.body.animalList, 
            linkList: req.body.linkList, 
            description: req.body.description 
       }).save((error, Sponsor) => {
           if (error) throw error;
           let message = SponsorMessages.success.s0;
           message.body = Sponsor;
           return res.header("location", "/sponsors/" + Sponsor._id).status(message.http).send(message);
       });
}


exports.update = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: req.body
    }, {
        new: true
    }, (error, Sponsor) => {
        if (error) throw error;
            if (!Sponsor) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
                let message = SponsorMessages.success.s1;
                message.body = Sponsor;
                return res.status(message.http).send(message);
    });
}


exports.delete = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.deleteOne({
        _id: req.params.id
    }, (error, result) => {
        if (error) throw error;
        if (result.deletedCount <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        return res.status(SponsorMessages.success.s3.http).send(SponsorMessages.success.s3);

    });
}

exports.getOne = (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.findOne({
            _id: req.params.id
        }, (error, Sponsor) => {
            if (error) throw error;
            if (!user) return res.status(SponsorMessages.error.e1.http).send(SponsorMessages.error.e1);
            let message = SponsorMessages.success.s2;
            message.body = Sponsor;
            return res.status(message.http).send(message);
        });
}

exports.activate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.updateOne({
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
        
        if (result.n <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        return res.status(SponsorMessages.success.s4.http).send(SponsorMessages.success.s4);

    });
}