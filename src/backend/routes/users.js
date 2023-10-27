const express = require('express');
const router = express.Router();
const xata = require('../config/config');
const bcrypt = require('bcrypt');

const { verifyUsernameInput, verifyEmailInput } = require('../controllers/userController');

router.put('/', async (req, res) => {
    try {
        if (req.session && req.session.authenticated)
            return res.status(400).json({message: 'Cannot register a account while logged in.'});

        const {email, username, password, password2} = req.body;

        const validUsername = await verifyUsernameInput(username);
        if (!validUsername)
            return res.status(400).json({message: 'Bad username.'});

        const existingUsername = await xata.db.users.select(['username']).filter({username: username}).getFirst();
        if (existingUsername)
            return res.status(400).json({message: 'Username already in use.'});

        const validEmail = await verifyEmailInput(email);
        if (!validEmail)
            return res.status(400).json({message: 'Bad email.'});

        const passwordsMatch = (password === password2);
        if (!passwordsMatch)
            return res.status(400).json({ message: 'Passwords do not match.'});

        const existingEmail = await xata.db.users.select(['email']).filter({email: email}).getFirst();
        if(existingEmail)
            return res.status(400).json({ message: 'User already exists.'});

        const generatedSalt = await bcrypt.genSalt(10);
        const record = await xata.db.users.create({
            email: email,
            username: username,
            password: await bcrypt.hash(password, generatedSalt)
        });

        if(!record)
            return res.status(500).json({ message: 'Something went wrong.' });

        req.session.authenticated = true;
        req.session.user = {
            id: record.id,
            username: record.username,
            email: record.email
        }

        res.status(201).json({ message: 'User created.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;