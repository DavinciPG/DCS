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
    cookie: { maxAge: 30000 },
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