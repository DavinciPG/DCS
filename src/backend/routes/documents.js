const express = require('express');
const router = express.Router();
const xata = require('../config/config');

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

router.get('/:id', verifySession, async (req, res) => {
    try {
        const data = await xata.db.documents.filter({id: req.params.id}).getFirst();
        const currentUserId = req.session.user.id;
        if(data.user.id !== currentUserId && data.documentPrivacy)
            return res.status(401).json({ message: 'Document is private.' });

        res.status(200).json({ data: data });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;