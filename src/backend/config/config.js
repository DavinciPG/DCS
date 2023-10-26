const { getXataClient } = require('../bin/xata');
const client = getXataClient();

// Client modifications can be done here before sending to the backend

module.exports = client;