const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization']; // Get the 'Authorization' header

    if (!authHeader) {
        return res.status(401).json({message: 'No token provided, please login first.'});
    }

    let token;
    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7, authHeader.length);  // Extract the token part
    } else {
        return res.status(401).json({message: 'Invalid token format. Token should be prefixed with "Bearer".'});
    }

    // Verify the token
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token using your secret
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({message: 'Failed to authenticate token.'});
    }
}

function authorize(req, res, next) {
    console.log("Authorization middleware called");
    next(); // Move to the next middleware or route handler
}

// Directly export the functions
module.exports = {
    authenticate,
    authorize
};
