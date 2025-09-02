const jwt = require('jsonwebtoken');

// move to env file
const JWT_SECRET = "123451234512345diuvbdewviuwvbuibhvwoei";

function GenerateToken(email, id) {
    const tPayload = { email, id };

    const t = jwt.sign(tPayload, JWT_SECRET, { expiresIn: '24hr' });
    return t;
};

module.exports = {
    GenerateToken
};