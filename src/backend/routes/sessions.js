const express = require('express');
const router = express.Router();
const xata = require('../config/config');

const { verifySession } = require("../controllers/sessionController");

module.exports = router;
