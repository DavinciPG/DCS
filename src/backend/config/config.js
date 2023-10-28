const { getXataClient } = require('../bin/xata');
const client = getXataClient( { apiKey: process.env.XATA_API_KEY } );

// Client modifications can be done here before sending to the backend

module.exports = client;