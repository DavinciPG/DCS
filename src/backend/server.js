const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sessionHandler = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
dotenv.config();

const sessionsRouter = require('./routes/sessions');
const usersRouter = require('./routes/users');
const documentsRouter = require('./routes/documents');

const server = express();

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
//server.use('/users', usersRouter);
//server.use('/documents', documentsRouter);

module.exports = server;