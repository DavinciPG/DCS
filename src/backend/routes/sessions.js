const express = require('express');
const router = express.Router();
const xata = require('../config/config');

const bcrypt = require('bcrypt');
const saltRounds= 10;

const { verifySession } = require("../controllers/sessionController");

async function verifyUsernameInput(input) {
    // username length is 3,16 char
    const regex = /^[a-zA-Z0-9_-]{3,16}$/;
    if(!regex.test(input))
        return false;

    return true;
}

router.post('/', async (req, res) => {
    if(req.session && req.session.authenticated)
       return res.status(400).send({ message: 'User already logged in.' });

    const { username, password } = req.body;

    const verifiedInput = await verifyUsernameInput(username);
    if(!verifiedInput)
        return res.status(400).send({ message: 'Bad username.' });

    const databaseUser = await xata.db.users.filter({username}).getFirst();
    if(!databaseUser)
        return res.status(400).send({ message: 'User not found.' });

    const passwordCompare = await bcrypt.compare(password, databaseUser.password);
    if(!passwordCompare)
        return res.status(400).send({ message: 'Password incorrect.' });

    req.session.authenticated = true;
    req.session.user = {
        id: databaseUser.id,
        username: databaseUser.username
    };

    res.status(201).send({ message: 'Successful login.' });
});

module.exports = router;
