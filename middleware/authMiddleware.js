
const jwt = require("jsonwebtoken");

/**
 * Vérifie le token JWT envoyé par le client.
 */
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Accès refusé. Token manquant."
            });
        }

        const token = authHeader.split(" ")[1];

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            return res.status(500).json({
                message: "Configuration JWT manquante."
            });
        }

        const decoded = jwt.verify(token, jwtSecret);

        req.user = {
            id: decoded.sub,
            email: decoded.email
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token invalide ou expiré."
        });
    }
};

module.exports = authMiddleware;
