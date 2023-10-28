const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sessionHandler = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
dotenv.config();
const { getXataClient } = require('./bin/xata');
const bcrypt = require('bcrypt');


const sessionsRouter = require('./routes/sessions');
const usersRouter = require('./routes/users');
const documentsRouter = require('./routes/documents');

const server = express();
// Initialize the xata client
const xata = getXataClient();

// session handling
server.use(sessionHandler({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1000 ms * 60s * 60m * 24h * 7d = 7d worth of seconds
    },
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());

server.use('/sessions', sessionsRouter);
server.use('/users', usersRouter);
server.use('/documents', documentsRouter);

// Serve 'users.html' from the 'public' directory
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

server.post('/users/signin', async (req, res) => {
    try {
        if (req.session && req.session.authenticated) {
            return res.status(400).json({ message: 'User is already signed in.' });
        }

        const { email, password } = req.body;

        // Find the user by email
        const user = await xata.db.users.filter({ email }).getFirst();

        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        // Set the session to indicate that the user is authenticated
        req.session.authenticated = true;
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        res.status(200).json({ message: 'Sign-in successful.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = server;