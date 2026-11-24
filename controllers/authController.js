const jwt = require('jsonwebtoken');
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Création d'un compte utilisateur
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires."
            });
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Cet utilisateur ou cet email existe déjà."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Compte créé avec succès.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Connexion utilisateur
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect."
            });
        }

        const passwordIsValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect."
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({
                message: "La configuration JWT est manquante."
            });
        }

        const token = jwt.sign(
            { sub: user._id.toString(), email: user.email },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        // Garder la session pour les pages web existantes.
        if (req.session) req.session.userId = user._id;

        res.status(200).json({
            message: "Connexion réussie.",
            token,
            tokenType: "Bearer",
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Connexion depuis le formulaire du site web
exports.loginPage = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).render("home", {
                error: "Email ou mot de passe incorrect."
            });
        }

        const passwordIsValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).render("home", {
                error: "Email ou mot de passe incorrect."
            });
        }

        req.session.userId = user._id;

        res.redirect("/dashboard");

    } catch (error) {
        console.error("Erreur de connexion :", error);

        res.status(500).render("home", {
            error: "Une erreur est survenue lors de la connexion."
        });
    }
};


// Déconnexion utilisateur
exports.logout = (req, res) => {
    if (!req.session) {
        return res.status(200).json({
            message: "Déconnexion réussie. Supprimez le token côté client."
        });
    }

    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                message: "Erreur lors de la déconnexion."
            });
        }

        res.clearCookie("connect.sid");

        res.status(200).json({
            message: "Déconnexion réussie."
        });
    });
};
