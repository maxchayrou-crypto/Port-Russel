
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des utilisateurs."
        });
    }
};

// Récupérer un utilisateur par son email
exports.getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.params.email
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable."
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération de l'utilisateur."
        });
    }
};

// Créer un utilisateur
exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Le mot de passe doit contenir au moins 8 caractères."
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
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
            message: "Utilisateur créé avec succès.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Les données fournies sont invalides.",
                errors: error.message
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Cet utilisateur ou cet email existe déjà."
            });
        }

        res.status(500).json({
            message: "Erreur lors de la création de l'utilisateur."
        });
    }
};

// Modifier un utilisateur
exports.updateUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const updates = {};

        if (username) {
            updates.username = username;
        }

        if (password) {
            if (password.length < 8) {
                return res.status(400).json({
                    message: "Le mot de passe doit contenir au moins 8 caractères."
                });
            }

            updates.password = await bcrypt.hash(password, 10);
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Aucune modification fournie."
            });
        }

        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            updates,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable."
            });
        }

        res.status(200).json({
            message: "Utilisateur modifié avec succès.",
            user
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Les données fournies sont invalides.",
                errors: error.message
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Ce nom d'utilisateur est déjà utilisé."
            });
        }

        res.status(500).json({
            message: "Erreur lors de la modification de l'utilisateur."
        });
    }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            email: req.params.email
        });

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable."
            });
        }

        res.status(200).json({
            message: "Utilisateur supprimé avec succès."
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression de l'utilisateur."
        });
    }
};
// Afficher les utilisateurs sur le site
exports.renderUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ username: 1 });

        res.render("users/index", {
            users
        });

    } catch (error) {
        console.error("Erreur affichage utilisateurs :", error);
        res.status(500).send(
            "Erreur lors du chargement des utilisateurs."
        );
    }
};
// Créer un utilisateur depuis le site
exports.createUserFromPage = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password || password.length < 8) {
            return res.status(400).send("Informations invalides. Le mot de passe doit contenir au moins 8 caractères.");
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).send("Cet utilisateur ou cet email existe déjà.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.redirect("/users");

    } catch (error) {
        console.error("Erreur création utilisateur :", error);
        res.status(500).send("Erreur lors de la création de l'utilisateur.");
    }
};
// Modifier un utilisateur depuis le site
exports.updateUserFromPage = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            email: req.params.email
        });

        if (!user) {
            return res.status(404).send("Utilisateur introuvable.");
        }

        if (!username || username.trim().length < 3) {
            return res.status(400).send("Le nom d'utilisateur doit contenir au moins 3 caractères.");
        }

        const existingUser = await User.findOne({
            username: username.trim(),
            _id: { $ne: user._id }
        });

        if (existingUser) {
            return res.status(409).send("Ce nom d'utilisateur est déjà utilisé.");
        }

        user.username = username.trim();

        if (password) {
            if (password.length < 8) {
                return res.status(400).send("Le mot de passe doit contenir au moins 8 caractères.");
            }

            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.redirect("/users");

    } catch (error) {
        console.error("Erreur modification utilisateur :", error);
        res.status(500).send("Erreur lors de la modification de l'utilisateur.");
    }
};
