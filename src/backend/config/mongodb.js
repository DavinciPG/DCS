// We are using a secondary database for session storage due to XATA not having a datastore module

const mongoose= require('mongoose');

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error(err));