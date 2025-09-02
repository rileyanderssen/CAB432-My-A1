const User = require("../models/user");
const { 
    GenerateToken 
} = require("../helpers/security")

exports.authenticateUser = (req, res) => {
    const { email, password } = req.body;

    const authData = User.authenticate(email, password);
    if (authData.valid) {
        const token = GenerateToken(email, authData.id);
        return res.status(200).json({ valid: true, token: token });
    } 
        
    return res.status(401).json({ valid: false, error: "Unauthorized" });
};

// for testing
exports.clearDatabase = (req, res) => {
    User.clearDb();

    return res.status(200).json({ message: "Mock database has been cleared" });
}