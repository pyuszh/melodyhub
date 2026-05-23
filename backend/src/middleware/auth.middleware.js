const jwt = require('jsonwebtoken');

function getToken(req) {

    // 1. Cookie token
    if (req.cookies && req.cookies.token) {
        return req.cookies.token;
    }

    // 2. Bearer token
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }

    return null;
}

async function authArtist(req, res, next) {

    const token = getToken(req);

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You have not access to create music"
            });
        }

        req.user = decoded;

        next();

    } catch (err) {

        console.error(err);

        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}

async function authUser(req, res, next) {

    const token = getToken(req);

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (err) {

        console.error(err);

        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}

module.exports = {
    authArtist,
    authUser
};