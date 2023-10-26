
// @func: In order for the "user" to access parts of the website which require for the "user" to be logged in, below functions makes sure of that
const verifySession = (req, res, next) => {
    if (req.session && req.session.authenticated && req.session.user) {
        // The session is valid
        next();
    } else {
        // The session is not valid; you can handle this as needed (e.g., redirect to a login page).
        res.status(401).json({ message: 'Unauthorized' });
    }
};

const deleteSession = (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json({ message: 'Logged out successfully' });
            }
        });
    }
};

module.exports = {
    verifySession,
    deleteSession
}