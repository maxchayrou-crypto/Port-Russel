const jwt = require("jsonwebtoken");

/** Vérifie le JWT transmis dans l'en-tête Authorization: Bearer <token>. */
module.exports = (req, res, next) => {
    const authorization = req.headers.authorization;
    const [scheme, token, extra] = authorization ? authorization.split(" ") : [];

    if (scheme?.toLowerCase() !== "bearer" || !token || extra) {
        return res.status(401).json({
            message: "Authentification requise. Fournissez un token Bearer valide."
        });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({
            message: "La configuration JWT est manquante."
        });
    }

    try {
        req.auth = jwt.verify(token, jwtSecret);
        next();
    } catch (error) {
        return res.status(401).json({
            message: error.name === "TokenExpiredError"
                ? "Le token a expiré. Veuillez vous reconnecter."
                : "Token invalide."
        });
    }
};
