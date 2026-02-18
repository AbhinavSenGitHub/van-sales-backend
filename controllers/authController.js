const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials for Demo/Admin
    const ADMIN_USERNAME = "admin_1234";
    const ADMIN_PASSWORD = "Password@1234";

    // Password validation checks
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long, contain one uppercase letter, one special character, and one number."
        });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jwt.sign(
            { username: ADMIN_USERNAME, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: { username: ADMIN_USERNAME, role: 'admin' }
        });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
};

module.exports = { login };
