const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const sessionsRouter = require('./routes/sessions');
const usersRouter = require('./routes/users');
const documentsRouter = require('./routes/documents');

const server = express();

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());

server.use('/sessions', sessionsRouter);
//server.use('/users', usersRouter);
//server.use('/documents', documentsRouter);

module.exports = server;
