const jwt = require('jsonwebtoken');
const {
    MISSING_TOKEN,
    TOKEN_EXPIRED,
    TOKEN_INVALID,
    TOKEN_EXPIRED_SYS
} = require("../constants/error");

// move to env file
const JWT_SECRET = "123451234512345diuvbdewviuwvbuibhvwoei";

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: MISSING_TOKEN });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === TOKEN_EXPIRED_SYS) {
                return res.status(401).json({ error: TOKEN_EXPIRED });
            }

            return res.status(403).json({ error: TOKEN_INVALID });
        }

        req.userDetails = decoded;
        next();
    })
}

module.exports = authenticateToken;