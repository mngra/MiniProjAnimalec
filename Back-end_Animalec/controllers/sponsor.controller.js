const Sponsor = require('../models/sponsor.model');
const {
    validationResult
} = require('express-validator');
const SponsorMessages = require("../messages/sponsor.messages");
const fs = require('fs').promises; 
const path = require('path');
const UPLOAD_DIR = path.join(__dirname, '../', 'uploads');

const parseJsonField = (body, field) => {
    if (body[field]) {
        try {
            return JSON.parse(body[field]);
        } catch (e) {
            console.error(`Erro ao fazer JSON.parse do campo ${field}:`, e);
            return [];
        }
    }
    return [];
};

const deleteFile = async (fileName) => {
    if (!fileName) return;
    const filePath = path.join(UPLOAD_DIR, fileName);
    try {
        await fs.unlink(filePath);
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error(`Falha ao eliminar ficheiro ${fileName}:`, err);
        }
    }
};

const getBase64Logo = async (filename) => {
    if (!filename) return null;

    const filePath = path.join(UPLOAD_DIR, filename);

    try {
        const fileBuffer = await fs.readFile(filePath);
        const ext = path.extname(filename).toLowerCase();
        let mimeType = 'application/octet-stream';
        
        if (ext === '.png') {
            mimeType = 'image/png';
        } else if (ext === '.jpg' || ext === '.jpeg') {
            mimeType = 'image/jpeg';
        } else if (ext === '.gif') {
            mimeType = 'image/gif';
        }

        const base64Image = fileBuffer.toString('base64');
        
        return `data:${mimeType};base64,${base64Image}`;
        
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error(`Erro ao ler o ficheiro Base64: ${filename}`, error);
        }
        return null;
    }
};

exports.get = (req, res) => {
    Sponsor.find(req.query).exec(async (error, sponsors) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ message: "Erro ao buscar patrocinadores.", error: error.message });
        }
        
        const processedSponsors = await Promise.all(sponsors.map(async (sponsor) => {
            const sponsorObject = sponsor.toObject();

            if (sponsorObject.logoPath!='') {
                sponsorObject.logoPath = await getBase64Logo(sponsorObject.logoPath);
            }
            return sponsorObject;
        }));

        let message = SponsorMessages.success.s2;
        if (processedSponsors.length <= 0)
            message = SponsorMessages.success.s5;
        
        message.body = processedSponsors;
        return res.status(message.http).send(message);
    });
};

exports.create = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        if (req.file) {
            deleteFile(req.file.filename);
        }
        return res.status(406).send(errors);
    }

    const rawBody = req.body;
    const logoFile = req.file;
    const sponsorData = {
        name: rawBody.name,
        email: rawBody.email,
        startDate: rawBody.startDate,
        endDate: rawBody.endDate,
        type: rawBody.type,
        sponsorshipValue: rawBody.sponsorshipValue,
        state: rawBody.state,
        description: rawBody.description,
        animalList: parseJsonField(rawBody, 'animalList'),
        linkList: parseJsonField(rawBody, 'linkList'),
    };
    
    if (logoFile) {
        sponsorData.logoPath = logoFile.filename;
    }

   new Sponsor(sponsorData).save((error, newSponsor) => {
        if (error) {
            if (req.file) {
                deleteFile(req.file.filename);
            }
            return res.status(500).send({ message: "Erro ao salvar patrocinador.", error: error.message });
        }
        let message = SponsorMessages.success.s0;
        message.body = newSponsor;
        return res.header("location", "/sponsors/" + newSponsor._id).status(message.http).send(message);
    });
}


exports.update = async (req, res) => {
    const errors = validationResult(req).array();
    
    if (errors.length > 0) {
        if (req.file) {
            deleteFile(req.file.filename);
        }
        return res.status(406).send(errors);
    }

    const sponsorId = req.params.id;
    const rawBody = req.body;
    const logoFile = req.file; 
    const updateData = {};
    const fieldsToCopy = ['name', 'email', 'startDate', 'endDate', 'type', 'sponsorshipValue', 'state', 'description'];
    
    fieldsToCopy.forEach(field => {
        if (rawBody[field] !== undefined) {
            updateData[field] = rawBody[field];
        }
    });
    if (rawBody.animalList !== undefined) {
        updateData.animalList = parseJsonField(rawBody, 'animalList');
    }
    if (rawBody.linkList !== undefined) {
        updateData.linkList = parseJsonField(rawBody, 'linkList');
    }

    try {
        if (logoFile) {
            const currentSponsor = await Sponsor.findById(sponsorId);
            
            if (currentSponsor && currentSponsor.logoPath) {
                await deleteFile(currentSponsor.logoPath);
            }

            updateData.logoPath = logoFile.filename;
        }

        const updatedSponsor = await Sponsor.findOneAndUpdate({
            _id: sponsorId
        }, {
            $set: updateData
        }, {
            new: true
        }).exec();

        if (!updatedSponsor) {
            if (req.file) {
                await deleteFile(req.file.filename);
            }
            return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        }

        let message = SponsorMessages.success.s1;
        message.body = updatedSponsor;
        return res.status(message.http).send(message);

    } catch (error) {
        if (req.file) {
            await deleteFile(req.file.filename);
        }
        console.error(error);
        return res.status(500).send({ message: "Erro ao atualizar patrocinador.", error: error.message });
    }
}


exports.delete = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    const sponsorId = req.params.id;

    try {
        const sponsor = await Sponsor.findById(sponsorId).exec();
        if (!sponsor) {
            return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        }

        const logoPath = sponsor.logoPath;
        const result = await Sponsor.deleteOne({ _id: sponsorId }).exec();

        if (result.deletedCount > 0) {
            await deleteFile(logoPath);
            return res.status(SponsorMessages.success.s3.http).send(SponsorMessages.success.s3);
        } else {
            return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro ao eliminar patrocinador.", error: error.message });
    }
}

exports.getOne = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const sponsor = await Sponsor.findOne({ _id: req.params.id }).exec();

        if (!sponsor) {
             return res.status(SponsorMessages.error.e1.http).send(SponsorMessages.error.e1);
        }

        const sponsorObject = sponsor.toObject();

        if (sponsorObject.logoPath) {
            sponsorObject.logoPath = await getBase64Logo(sponsorObject.logoPath);
        }

        let message = SponsorMessages.success.s2;
        message.body = sponsorObject;
        return res.status(message.http).send(message);

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro ao buscar patrocinador.", error: error.message });
    }
};

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
        if (error) {
            console.error(error);
            return res.status(500).send({ message: "Erro ao ativar patrocinador.", error: error.message });
        }
        if (result.matchedCount <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        return res.status(SponsorMessages.success.s6.http).send(SponsorMessages.success.s6); 

    });
}

exports.deactivate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.updateOne({
        _id: req.params.id
    }, {
        $set: {
            state: "inativo"
        }
    }, (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ message: "Erro ao desativar patrocinador.", error: error.message });
        }
        
        if (result.matchedCount <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        return res.status(SponsorMessages.success.s4.http).send(SponsorMessages.success.s4);

    });
}