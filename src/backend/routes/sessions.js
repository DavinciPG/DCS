const express = require('express');
const router = express.Router();
const xata = require('../config/config');

const bcrypt = require('bcrypt');

const { verifyEmailInput } = require('../controllers/userController');

const { verifySession, deleteSession } = require("../controllers/sessionController");

router.post('/', async (req, res) => {
   try {
       if (req.session && req.session.authenticated)
           return res.status(400).json({ message: 'User already logged in.'});

       const {email, password} = req.body;

       const verifiedInput = await verifyEmailInput(email);
       if (!verifiedInput)
           return res.status(400).json({message: 'Bad email.'});

       const databaseUser = await xata.db.users.filter({email: email}).getFirst();
       if (!databaseUser)
           return res.status(400).json({message: 'User not found.'});

       const passwordCompare = await bcrypt.compare(password, databaseUser.password);
       if (!passwordCompare)
           return res.status(400).json({message: 'Password incorrect.'});

       req.session.authenticated = true;
       req.session.user = {
           id: databaseUser.id,
           username: databaseUser.username,
           email: databaseUser.email
       };

       res.status(200).json({message: 'Successful login.'});
   } catch (err) {
       console.error(err);
       res.status(500).json({message: 'Internal Server Error.'});
   }
});

router.delete('/', verifySession, deleteSession);

module.exports = router;
