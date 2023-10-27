const express = require('express');
const router = express.Router();
const xata = require('../config/config');
const File = require('../classes/File');

const { verifySession } = require("../controllers/sessionController");

// @endpoint: returns current users documents
router.get('/', verifySession, async (req, res) => {
    try {
        const data = await xata.db.documents.filter({user: req.session.user.id}).getMany();
        res.status(200).json({ data: data });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// @endpoint: returns document information for given :id
router.get('/:id', verifySession, async (req, res) => {
    try {
        const data = await xata.db.documents.filter({id: req.params.id}).getFirst();
        const currentUserId = req.session.user.id;

        const privileges = await xata.db.privileges.select(['privilege_view']).filter({'document.id': data.id, 'user.id': currentUserId}).getFirst();

        if(data.user.id !== currentUserId && (data.documentPrivacy && !privileges?.privilege_view))
            return res.status(401).json({ message: 'Document is private.' });

        res.status(200).json({ data: data });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// @endpoint: returns file for the given document
router.get('/:id/file', verifySession, async (req, res) => {
    try {
        const data = await xata.db.documents.filter({id: req.params.id}).getFirst();
        const currentUserId = req.session.user.id;

        const privileges = await xata.db.privileges.select(['privilege_view']).filter({'document.id': data.id, 'user.id': currentUserId}).getFirst();

        if(data.user.id !== currentUserId && (data.documentPrivacy && !privileges?.privilege_view))
            return res.status(401).json({ message: 'Document is private.' });

        const file = new File(`${data.id}.${data.fileType}`);
        const contentType = await file.getContentType();

        res.setHeader('Content-Type', contentType);
        res.status(200).sendFile(file.filePath);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;